import React, { useState, useEffect } from 'react';
import words from './words.json';
import './App.css';

function App() {
  const [wordList, setWordList] = useState([]);
  const [revealedWords, setRevealedWords] = useState(Array(10).fill(false));

  useEffect(() => {
    changeWord();
  }, []);

  const changeWord = () => {
    const realWord = words[Math.floor(Math.random() * words.length)];
    
    const newWordList = Array(10).fill(realWord);
    const impostorIndexes = [];
    
    while (impostorIndexes.length < 2) {
      const randomIndex = Math.floor(Math.random() * 10);
      if (!impostorIndexes.includes(randomIndex)) {
        impostorIndexes.push(randomIndex);
        newWordList[randomIndex] = 'Imposter';
      }
    }

    setWordList(newWordList);
    setRevealedWords(Array(10).fill(false));
  };

  const handleRevealWord = (index) => {
    setRevealedWords((prevRevealedWords) => {
      const newRevealedWords = [...prevRevealedWords];
      newRevealedWords[index] = !newRevealedWords[index];
      return newRevealedWords;
    });
  };

  const handleRemoveWord = (index) => {
    setWordList((prevWordList) => prevWordList.filter((_, i) => i !== index));
    setRevealedWords((prevRevealedWords) => prevRevealedWords.filter((_, i) => i !== index));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Wortanzeige</h1>
        <div className="card-container">
          {wordList.map((word, index) => (
            <div className="card" key={index}>
              {revealedWords[index] ? (
                <>
                  <p>{word}</p>
                  <button onClick={() => handleRemoveWord(index)}>Entfernen</button>
                </>
              ) : (
                <button onClick={() => handleRevealWord(index)}>Karte umdrehen</button>
              )}
            </div>
          ))}
        </div>
        {wordList.length === 0 && (
          <button onClick={changeWord} style={{ marginTop: '20px' }}>Neues Wort</button>
        )}
      </header>
    </div>
  );
}

export default App;
