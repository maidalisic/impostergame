import React, { useState, useEffect } from 'react';
import normalWords from './words.json';
import countryWords from './countries.json';
import adultWords from './adults.json';
import './App.css';

function App() {
  const [numPlayers, setNumPlayers] = useState(0);
  const [numImposters, setNumImposters] = useState(0);
  const [step, setStep] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [wordList, setWordList] = useState([]);
  const [revealedWords, setRevealedWords] = useState([]);
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const [mode, setMode] = useState('normal');

  useEffect(() => {
    if (gameStarted) {
      initializeGame();
    }
  }, [gameStarted]);

  const initializeGame = () => {
    let words;
    switch (mode) {
      case 'countries':
        words = countryWords;
        break;
      case 'adults':
        words = adultWords;
        break;
      case 'normal':
      default:
        words = normalWords;
        break;
    }
    const realWord = words[Math.floor(Math.random() * words.length)];
    const newWordList = Array(numPlayers).fill(realWord);
    const impostorIndexes = [];

    while (impostorIndexes.length < numImposters) {
      const randomIndex = Math.floor(Math.random() * numPlayers);
      if (!impostorIndexes.includes(randomIndex)) {
        impostorIndexes.push(randomIndex);
        newWordList[randomIndex] = 'Imposter';
      }
    }

    setWordList(newWordList);
    setRevealedWords(Array(numPlayers).fill(false));
  };

  const handleRevealWord = (index) => {
    setRevealedWords((prevRevealedWords) => {
      const newRevealedWords = [...prevRevealedWords];
      newRevealedWords[index] = !newRevealedWords[index];
      return newRevealedWords;
    });
    setActiveCardIndex(index);
  };

  const handleRemoveWord = (index) => {
    setWordList((prevWordList) => prevWordList.filter((_, i) => i !== index));
    setRevealedWords((prevRevealedWords) => prevRevealedWords.filter((_, i) => i !== index));
    setActiveCardIndex(null);
  };

  const renderPlayerButtons = () => {
    const buttons = [];
    for (let i = 3; i <= 11; i++) {
      buttons.push(
        <button key={i} onClick={() => setNumPlayers(i)} className={numPlayers === i ? 'selected' : ''}>
          {i}
        </button>
      );
    }
    return buttons;
  };

  const renderImposterButtons = () => {
    const buttons = [];
    for (let i = 1; i <= 3; i++) {
      buttons.push(
        <button key={i} onClick={() => setNumImposters(i)} className={numImposters === i ? 'selected' : ''}>
          {i}
        </button>
      );
    }
    return buttons;
  };

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Word Guesser</h1>
        {!gameStarted ? (
          <>
            {step === 1 && (
              <div>
                <h2>Modus auswählen:</h2>
                <div className="button-grid">
                  <button onClick={() => setMode('normal')} className={mode === 'normal' ? 'selected' : ''}>Normal</button>
                  <button onClick={() => setMode('countries')} className={mode === 'countries' ? 'selected' : ''}>Länder</button>
                  <button onClick={() => setMode('adults')} className={mode === 'adults' ? 'selected' : ''}>18+</button>
                </div>
                <button onClick={() => setStep(2)}>Weiter</button>
              </div>
            )}
            {step === 2 && (
              <div>
                <h2>Anzahl der Spieler:</h2>
                <div className="button-grid">
                  {renderPlayerButtons()}
                  <input
                    type="number"
                    placeholder="Mehr als 11"
                    onChange={(e) => setNumPlayers(Number(e.target.value))}
                    min="12"
                  />
                </div>
                <button onClick={() => setStep(3)} disabled={numPlayers < 3}>Weiter</button>
                <button onClick={() => setStep(1)}>Zurück</button>
              </div>
            )}
            {step === 3 && (
              <div>
                <h2>Anzahl der Imposter:</h2>
                <div className="button-grid">
                  {renderImposterButtons()}
                  <input
                    type="number"
                    placeholder="Mehr als 3"
                    onChange={(e) => setNumImposters(Number(e.target.value))}
                    min="4"
                  />
                </div>
                <button onClick={startGame} disabled={numImposters < 1 || numImposters >= numPlayers}>Spiel starten</button>
                <button onClick={() => setStep(2)}>Zurück</button>
              </div>
            )}
          </>
        ) : (
          <div className={`card-container ${activeCardIndex !== null ? 'blurred' : ''}`}>
            {wordList.map((word, index) => (
              <div className={`card ${activeCardIndex === index ? 'active' : ''}`} key={index}>
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
            {wordList.length === 0 && (
              <button onClick={() => setGameStarted(false)} style={{ marginTop: '20px' }}>Neues Spiel</button>
            )}
          </div>
        )}
      </header>
      <footer className="App-footer">
        <p>Developed with love in Maid's Keller</p>
      </footer>
    </div>
  );
}

export default App;