import React from 'react';
import WordDefinition from '../components/WordDefinition';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const InfoBox = ({ position, wordData, loading, error, onClose }) => {
  if (!position) return null;

  return (
    <div
      className="word-info-box fixed z-[10000] bg-white rounded-lg shadow-2xl border border-gray-300 max-w-md w-96"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
        <h3 className="text-sm font-semibold text-gray-700">Word Information</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading && <LoadingSpinner />}
        {error && <div className="p-4"><ErrorMessage message={error} /></div>}
        {wordData && !loading && !error && <WordDefinition wordData={wordData} />}
      </div>
    </div>
  );
};

export default InfoBox;