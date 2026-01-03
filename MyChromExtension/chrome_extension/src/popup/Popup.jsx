import React, { useState, useEffect } from 'react';
import WordDefinition from '../components/WordDefinition';
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
        setError(response.error || 'Information not found');
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
        <p className="text-sm text-blue-100">Get instant Wikipedia information</p>
      </div>

      <div className="p-4">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="Search anything..."
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <p>Search anything or select text on any webpage</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;