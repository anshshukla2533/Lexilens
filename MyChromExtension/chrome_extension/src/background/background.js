// Background service worker

// Listen for keyboard shortcut (Ctrl+Shift+Y)
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'search-clipboard') {
    try {
      // Read text from clipboard
      const clipboardText = await navigator.clipboard.readText();
      
      if (!clipboardText || !clipboardText.trim()) {
        console.log('Clipboard is empty');
        // Still open popup even if clipboard is empty
        chrome.action.openPopup();
        return;
      }

      const word = clipboardText.trim();
      
      // Store the clipboard word temporarily
      await chrome.storage.local.set({ 
        clipboardWord: word,
        triggerSearch: true 
      });
      
      // Open the popup
      chrome.action.openPopup();
      
    } catch (error) {
      console.error('Error reading clipboard:', error);
      // Still try to open popup
      chrome.action.openPopup();
    }
  }
});

// Listen for messages from popup and content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchWordInfo') {
    fetchWordData(request.word)
      .then(data => {
        // Save to history
        saveToHistory(request.word, data);
        sendResponse({ success: true, data });
      })
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
  
  if (request.action === 'getClipboardWord') {
    chrome.storage.local.get(['clipboardWord', 'triggerSearch'], (result) => {
      sendResponse({ 
        word: result.clipboardWord || '',
        triggerSearch: result.triggerSearch || false
      });
      // Clear the trigger flag
      chrome.storage.local.remove(['clipboardWord', 'triggerSearch']);
    });
    return true;
  }
});

// Fetch word information from Wikipedia
async function fetchWordData(word) {
  const WIKIPEDIA_API = 'https://en.wikipedia.org/api/rest_v1/page/summary';
  const WIKIPEDIA_SEARCH_API = 'https://en.wikipedia.org/w/api.php';
  
  try {
    // First, search for the term to get the correct page title
    const searchUrl = `${WIKIPEDIA_SEARCH_API}?action=opensearch&search=${encodeURIComponent(word)}&limit=1&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (!searchData[1] || searchData[1].length === 0) {
      throw new Error('No results found');
    }
    
    const pageTitle = searchData[1][0];
    const pageUrl = searchData[3][0];
    
    // Get page summary
    const summaryResponse = await fetch(`${WIKIPEDIA_API}/${encodeURIComponent(pageTitle)}`);
    
    if (!summaryResponse.ok) {
      throw new Error('Information not found');
    }
    
    const summaryData = await summaryResponse.json();
    return formatWikipediaData(summaryData, pageUrl);
  } catch (error) {
    throw error;
  }
}

function formatWikipediaData(data, pageUrl) {
  return {
    word: data.title,
    extract: data.extract,
    description: data.description || '',
    thumbnail: data.thumbnail?.source || null,
    url: pageUrl,
    type: data.type || 'standard'
  };
}

// Save search to history
async function saveToHistory(word, data) {
  const result = await chrome.storage.local.get(['searchHistory']);
  let history = result.searchHistory || [];
  
  // Add new search at the beginning
  history.unshift({
    word: word,
    timestamp: Date.now()
  });
  
  // Keep only last 10 searches
  history = history.slice(0, 10);
  
  await chrome.storage.local.set({ searchHistory: history });
}

// Context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'getWordInfo',
    title: 'Get word info: "%s"',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'getWordInfo') {
    chrome.tabs.sendMessage(tab.id, {
      action: 'showWordInfo',
      word: info.selectionText
    });
  }
});