// Background service worker

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchWordInfo') {
    fetchWordData(request.word)
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
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