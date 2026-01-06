import React, { useState, useEffect } from 'react';
import InfoBox from './InfoBox';

const ContentScript = () => {
  const [position, setPosition] = useState(null);
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedWord, setSelectedWord] = useState('');

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text && text.split(' ').length === 1) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setPosition({
          x: rect.left + window.scrollX,
          y: rect.bottom + window.scrollY + 10
        });
        
        setSelectedWord(text);
        fetchWordInfo(text);
      } else {
        handleClose();
      }
    };

    document.addEventListener('mouseup', handleSelection);
    
    return () => {
      document.removeEventListener('mouseup', handleSelection);
    };
  }, []);

  // Listen for messages from background script
  useEffect(() => {
    const messageListener = (message) => {
      // Handle context menu selection
      if (message.action === 'showWordInfo') {
        setSelectedWord(message.word);
        fetchWordInfo(message.word);
        
        // Position at center of viewport
        setPosition({
          x: window.innerWidth / 2 - 200,
          y: window.scrollY + 100
        });
      }
      
      // Handle Ctrl+Shift+Y clipboard search
      if (message.action === 'showWordInfoFromClipboard') {
        if (message.error) {
          setError(message.error);
          setLoading(false);
          setWordData(null);
          setSelectedWord('');
          
          // Position at center of viewport
          setPosition({
            x: window.innerWidth / 2 - 200,
            y: window.scrollY + 100
          });
        } else if (message.data) {
          setSelectedWord(message.word);
          setWordData(message.data);
          setError(null);
          setLoading(false);
          
          // Position at center of viewport
          setPosition({
            x: window.innerWidth / 2 - 200,
            y: window.scrollY + 100
          });
        }
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const fetchWordInfo = async (word) => {
    setLoading(true);
    setError(null);
    setWordData(null);

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'fetchWordInfo',
        word: word
      });

      if (response.success) {
        setWordData(response.data);
      } else {
        setError(response.error || 'Failed to fetch word information');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPosition(null);
    setWordData(null);
    setError(null);
    setSelectedWord('');
  };

  return (
    <InfoBox
      position={position}
      wordData={wordData}
      loading={loading}
      error={error}
      onClose={handleClose}
    />
  );
};

export default ContentScript;