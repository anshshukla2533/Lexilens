// Background service worker

// Listen for keyboard shortcut (Ctrl+Shift+Y)
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'search-clipboard') {
    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        console.error('No active tab found');
        return;
      }

      // Get selected text from the page
      const result = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection().toString().trim()
      });

      const selectedText = result[0]?.result || '';
      
      if (!selectedText) {
        console.log('No text selected');
        // Still open popup even if nothing is selected
        chrome.action.openPopup();
        return;
      }

      // Store the selected word temporarily
      await chrome.storage.local.set({ 
        selectedWord: selectedText,
        triggerSearch: true 
      });
      
      // Open the popup
      chrome.action.openPopup();
      
    } catch (error) {
      console.error('Error getting selected text:', error);
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
  
  if (request.action === 'getSelectedWord') {
    chrome.storage.local.get(['selectedWord', 'triggerSearch'], (result) => {
      sendResponse({ 
        word: result.selectedWord || '',
        triggerSearch: result.triggerSearch || false
      });
      // Clear the trigger flag
      chrome.storage.local.remove(['selectedWord', 'triggerSearch']);
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