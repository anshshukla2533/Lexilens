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

// Fetch word information
async function fetchWordData(word) {
  const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';
  
  try {
    const response = await fetch(`${DICTIONARY_API}/${word.toLowerCase()}`);
    
    if (!response.ok) {
      throw new Error('Word not found');
    }
    
    const data = await response.json();
    return formatWordData(data[0]);
  } catch (error) {
    throw error;
  }
}

function formatWordData(data) {
  const meanings = data.meanings.map(meaning => ({
    partOfSpeech: meaning.partOfSpeech,
    definitions: meaning.definitions.slice(0, 3).map(def => ({
      definition: def.definition,
      example: def.example || null,
      synonyms: def.synonyms || []
    }))
  }));

  return {
    word: data.word,
    phonetic: data.phonetic || '',
    meanings: meanings,
    sourceUrls: data.sourceUrls || []
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