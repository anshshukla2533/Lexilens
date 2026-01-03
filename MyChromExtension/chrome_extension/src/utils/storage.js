// Chrome storage utilities

export const saveToStorage = async (key, value) => {
  try {
    await chrome.storage.local.set({ [key]: value });
    return true;
  } catch (error) {
    console.error('Error saving to storage:', error);
    return false;
  }
};

export const getFromStorage = async (key) => {
  try {
    const result = await chrome.storage.local.get(key);
    return result[key] || null;
  } catch (error) {
    console.error('Error getting from storage:', error);
    return null;
  }
};

export const removeFromStorage = async (key) => {
  try {
    await chrome.storage.local.remove(key);
    return true;
  } catch (error) {
    console.error('Error removing from storage:', error);
    return false;
  }
};

// History management
export const addToHistory = async (word, data) => {
  const history = await getFromStorage('searchHistory') || [];
  const newEntry = {
    word,
    data,
    timestamp: Date.now()
  };
  
  // Keep only last 50 entries
  const updatedHistory = [newEntry, ...history.filter(h => h.word !== word)].slice(0, 50);
  await saveToStorage('searchHistory', updatedHistory);
};

export const getHistory = async () => {
  return await getFromStorage('searchHistory') || [];
};