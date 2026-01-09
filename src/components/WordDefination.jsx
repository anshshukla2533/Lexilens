import React from 'react';

const WordDefinition = ({ wordData }) => {
  if (!wordData) return null;

  const styles = {
    container: { padding: '16px', fontFamily: 'system-ui, -apple-system, sans-serif' },
    header: { borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' },
    title: { fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 },
    description: { fontSize: '14px', color: '#2563eb', fontWeight: '500', marginTop: '4px' },
    imageContainer: { display: 'flex', justifyContent: 'center', marginTop: '16px', marginBottom: '16px' },
    image: { borderRadius: '8px', maxHeight: '192px', objectFit: 'cover' },
    content: { marginTop: '12px' },
    extract: { color: '#1f2937', lineHeight: '1.6', margin: 0 },
    link: {
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: '14px',
      color: '#2563eb',
      fontWeight: '500',
      textDecoration: 'none',
      marginTop: '12px'
    },
    footer: {
      paddingTop: '12px',
      borderTop: '1px solid #e5e7eb',
      marginTop: '12px',
      fontSize: '12px',
      color: '#6b7280'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>{wordData.word}</h2>
        {wordData.description && (
          <p style={styles.description}>{wordData.description}</p>
        )}
      </div>

      {wordData.thumbnail && (
        <div style={styles.imageContainer}>
          <img 
            src={wordData.thumbnail} 
            alt={wordData.word}
            style={styles.image}
          />
        </div>
      )}

      <div style={styles.content}>
        <p style={styles.extract}>{wordData.extract}</p>
        
        {wordData.url && (
          <a
            href={wordData.url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            Read more on Wikipedia →
          </a>
        )}
      </div>

      <div style={styles.footer}>
        Source: Wikipedia
      </div>
    </div>
  );
};

export default WordDefinition;