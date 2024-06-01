import React, { useState, useEffect, useCallback } from "react";
import normalWords from "./words.json";
import countryWords from "./countries.json";
import adultWords from "./adults.json";
import celebritiesWords from "./celebrities.json";
import "./App.css";

function App() {
    const [numPlayers, setNumPlayers] = useState(0);
    const [numImposters, setNumImposters] = useState(0);
    const [step, setStep] = useState(1);
    const [gameStarted, setGameStarted] = useState(false);
    const [wordList, setWordList] = useState([]);
    const [revealedWords, setRevealedWords] = useState([]);
    const [activeCardIndex, setActiveCardIndex] = useState(null);
    const [mode, setMode] = useState("normal");
    const [showInfo, setShowInfo] = useState(false);
    const [showCard, setShowCard] = useState(null);

    const initializeGame = useCallback(() => {
        let words;
        switch (mode) {
            case "countries":
                words = countryWords;
                break;
            case "adults":
                words = adultWords;
                break;
            case "celebrities":
                words = celebritiesWords;
                break;
            case "normal":
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
                newWordList[randomIndex] = "Imposter";
            }
        }

        setWordList(newWordList);
        setRevealedWords(Array(numPlayers).fill(false));
    }, [mode, numPlayers, numImposters]);

    useEffect(() => {
        if (gameStarted) {
            initializeGame();
        }
    }, [gameStarted, initializeGame]);

    const handleRevealWord = (index) => {
        setShowCard(wordList[index]);
        setActiveCardIndex(index);
    };

    const handleRemoveWord = (index) => {
        setWordList((prevWordList) =>
            prevWordList.filter((_, i) => i !== index)
        );
        setRevealedWords((prevRevealedWords) =>
            prevRevealedWords.filter((_, i) => i !== index)
        );
        setShowCard(null);
        setActiveCardIndex(null);
    };

    const renderPlayerButtons = () => {
        const buttons = [];
        for (let i = 3; i <= 11; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => setNumPlayers(i)}
                    className={numPlayers === i ? "selected" : ""}
                >
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
                <button
                    key={i}
                    onClick={() => setNumImposters(i)}
                    className={numImposters === i ? "selected" : ""}
                >
                    {i}
                </button>
            );
        }
        return buttons;
    };

    const startGame = () => {
        setGameStarted(true);
    };

    const resetGame = () => {
        setGameStarted(false);
        setStep(1);
        setNumPlayers(0);
        setNumImposters(0);
        setMode("normal");
    };

    return (
        <div className="App">
            <button className="home-button" onClick={resetGame}>
                🏠
            </button>
            <button className="info-button" onClick={() => setShowInfo(true)}>
                ℹ️
            </button>
            {showInfo && (
                <div className="info-overlay">
                    <div className="info-content">
                        <button
                            className="close-button"
                            onClick={() => setShowInfo(false)}
                        >
                            X
                        </button>
                        <h2>Spielanleitung</h2>
                        <p>
                            Word Guesser ist ein Spiel, bei dem die meisten
                            Spieler das gleiche Wort sehen, aber einige sehen
                            "Imposter". Ziel des Spiels ist es, die Imposter zu
                            identifizieren.
                        </p>
                        <p>Spielablauf:</p>
                        <ul>
                            <li>Wähle die Anzahl der Spieler und Imposter.</li>
                            <li>
                                Starte das Spiel. Jeder Spieler sieht eine Karte
                                mit einem Wort oder "Imposter".
                            </li>
                            <li>
                                Diskutiert und versucht herauszufinden, wer die
                                Imposter sind.
                            </li>
                            <li>
                                Die Imposter versuchen, unentdeckt zu bleiben.
                            </li>
                        </ul>
                    </div>
                </div>
            )}
            {showCard && (
                <div className="info-overlay">
                    <div className="info-content">
                        <button
                            className="close-button"
                            onClick={() => handleRemoveWord(activeCardIndex)}
                        >
                            X
                        </button>
                        <p>{showCard}</p>
                    </div>
                </div>
            )}
            <header className="App-header">
                <h1>Word Guesser</h1>
                {!gameStarted ? (
                    <>
                        {step === 1 && (
                            <div>
                                <h2>Modus auswählen:</h2>
                                <div className="button-grid">
                                    <button
                                        onClick={() => setMode("normal")}
                                        className={
                                            mode === "normal" ? "selected" : ""
                                        }
                                    >
                                        Normal
                                    </button>
                                    <button
                                        onClick={() => setMode("countries")}
                                        className={
                                            mode === "countries"
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        Länder
                                    </button>
                                    <button
                                        onClick={() => setMode("adults")}
                                        className={
                                            mode === "adults" ? "selected" : ""
                                        }
                                    >
                                        18+
                                    </button>
                                    <button
                                        onClick={() => setMode("celebrities")}
                                        className={
                                            mode === "celebrities"
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        Berühmtheiten
                                    </button>
                                </div>
                                <button onClick={() => setStep(2)}>
                                    Weiter
                                </button>
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
                                        onChange={(e) =>
                                            setNumPlayers(
                                                Number(e.target.value)
                                            )
                                        }
                                        min="12"
                                    />
                                </div>
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={numPlayers < 3}
                                >
                                    Weiter
                                </button>
                                <button onClick={() => setStep(1)}>
                                    Zurück
                                </button>
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
                                        onChange={(e) =>
                                            setNumImposters(
                                                Number(e.target.value)
                                            )
                                        }
                                        min="4"
                                    />
                                </div>
                                <button
                                    onClick={startGame}
                                    disabled={
                                        numImposters < 1 ||
                                        numImposters >= numPlayers
                                    }
                                >
                                    Spiel starten
                                </button>
                                <button onClick={() => setStep(2)}>
                                    Zurück
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="game-info">
                        <p>Spiel gestartet mit {numPlayers} Spielern</p>
                        <div className="card-container">
                            {wordList.map((word, index) => (
                                <div className="card" key={index}>
                                    {revealedWords[index] ? (
                                        <>
                                            <p>{word}</p>
                                            <button
                                                onClick={() =>
                                                    handleRemoveWord(index)
                                                }
                                            >
                                                Entfernen
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                handleRevealWord(index)
                                            }
                                        >
                                            Karte umdrehen
                                        </button>
                                    )}
                                </div>
                            ))}
                            {wordList.length === 0 && (
                                <button
                                    onClick={resetGame}
                                    style={{ marginTop: "20px" }}
                                >
                                    Neues Spiel
                                </button>
                            )}
                        </div>
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
