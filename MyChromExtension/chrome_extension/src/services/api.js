// API service for fetching word information from Wikipedia

const WIKIPEDIA_API = 'https://en.wikipedia.org/api/rest_v1/page/summary';
const WIKIPEDIA_SEARCH_API = 'https://en.wikipedia.org/w/api.php';

export const fetchWordInfo = async (word) => {
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
    console.error('Error fetching word info:', error);
    throw error;
  }
};

const formatWikipediaData = (data, pageUrl) => {
  return {
    word: data.title,
    extract: data.extract,
    description: data.description || '',
    thumbnail: data.thumbnail?.source || null,
    url: pageUrl,
    type: data.type || 'standard'
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