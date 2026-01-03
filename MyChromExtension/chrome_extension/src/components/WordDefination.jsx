import React from 'react';

const WordDefinition = ({ wordData }) => {
  if (!wordData) return null;

  return (
    <div className="p-4 space-y-4">
      <div className="border-b pb-3">
        <h2 className="text-2xl font-bold text-gray-900">{wordData.word}</h2>
        {wordData.description && (
          <p className="text-sm text-blue-600 font-medium mt-1">{wordData.description}</p>
        )}
      </div>

      {wordData.thumbnail && (
        <div className="flex justify-center">
          <img 
            src={wordData.thumbnail} 
            alt={wordData.word}
            className="rounded-lg max-h-48 object-cover"
          />
        </div>
      )}

      <div className="space-y-3">
        <p className="text-gray-800 leading-relaxed">{wordData.extract}</p>
        
        {wordData.url && (
          <a
            href={wordData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Read more on Wikipedia
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>

      <div className="pt-3 border-t text-xs text-gray-500">
        Source: Wikipedia
      </div>
    </div>
  );
};

export default WordDefinition;