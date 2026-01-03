import React, { useState, useEffect } from 'react';
import WordDefinition from '../components/WordDefination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getHistory } from '../utils/storage';

const Popup = () => {
  const [searchWord, setSearchWord] = useState('');
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const hist = await getHistory();
    setHistory(hist);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchWord.trim()) return;

    setLoading(true);
    setError(null);
    setWordData(null);

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'fetchWordInfo',
        word: searchWord
      });

      if (response.success) {
        setWordData(response.data);
        loadHistory();
      } else {
        setError(response.error || 'Word not found');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (word) => {
    setSearchWord(word);
    setShowHistory(false);
  };

  return (
    <div className="w-96 min-h-[400px] max-h-[600px] bg-white">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
        <h1 className="text-xl font-bold">Word Info Extension</h1>
        <p className="text-sm text-blue-100">Get instant word definitions</p>
      </div>

      <div className="p-4">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="Enter a word..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Search
            </button>
          </div>
        </form>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm text-blue-600 hover:text-blue-700 mb-3"
        >
          {showHistory ? 'Hide' : 'Show'} History
        </button>

        {showHistory && history.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
            <p className="text-xs text-gray-600 mb-2">Recent searches:</p>
            {history.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleHistoryClick(item.word)}
                className="block text-sm text-blue-600 hover:text-blue-700 mb-1"
              >
                {item.word}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-y-auto max-h-96">
          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          {wordData && !loading && !error && <WordDefinition wordData={wordData} />}
          
          {!loading && !error && !wordData && (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p>Search for a word or select text on any webpage</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;