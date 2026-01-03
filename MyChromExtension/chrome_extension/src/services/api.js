// API service for fetching word information

const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export const fetchWordInfo = async (word) => {
  try {
    const response = await fetch(`${DICTIONARY_API}/${word.toLowerCase()}`);
    
    if (!response.ok) {
      throw new Error('Word not found');
    }
    
    const data = await response.json();
    return formatWordData(data[0]);
  } catch (error) {
    console.error('Error fetching word info:', error);
    throw error;
  }
};

const formatWordData = (data) => {
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
};

// Cache mechanism
const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const getCachedWordInfo = async (word) => {
  const cached = cache.get(word.toLowerCase());
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const data = await fetchWordInfo(word);
  cache.set(word.toLowerCase(), {
    data,
    timestamp: Date.now()
  });
  
  return data;
};