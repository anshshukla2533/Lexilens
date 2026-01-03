import React from 'react';

const WordDefinition = ({ wordData }) => {
  if (!wordData) return null;

  return (
    <div className="p-4 space-y-4">
      <div className="border-b pb-3">
        <h2 className="text-2xl font-bold text-gray-900">{wordData.word}</h2>
        {wordData.phonetic && (
          <p className="text-gray-600 italic mt-1">{wordData.phonetic}</p>
        )}
      </div>

      <div className="space-y-4">
        {wordData.meanings.map((meaning, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              {meaning.partOfSpeech}
            </h3>
            
            <div className="space-y-3">
              {meaning.definitions.map((def, defIdx) => (
                <div key={defIdx} className="pl-4 border-l-2 border-gray-200">
                  <p className="text-gray-800">{def.definition}</p>
                  
                  {def.example && (
                    <p className="text-gray-600 italic text-sm mt-1">
                      Example: "{def.example}"
                    </p>
                  )}
                  
                  {def.synonyms.length > 0 && (
                    <div className="mt-1">
                      <span className="text-xs text-gray-500">Synonyms: </span>
                      <span className="text-xs text-blue-600">
                        {def.synonyms.slice(0, 5).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordDefinition;
