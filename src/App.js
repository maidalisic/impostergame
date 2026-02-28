import { useState, useEffect, useCallback, useRef } from "react";
import normalWords from "./words.json";
import countryWords from "./countries.json";
import adultWords from "./adults.json";
import celebritiesWords from "./celebrities.json";
import jobsWords from "./jobs.json";
import jugendwoerter from "./jugendwoerter.json";
import { applyTheme } from "./theme";
import "./App.css";

const MODES = ["normal", "countries", "adults", "celebrities", "jobs", "jugendwoerter"];

function getItemsByMode(mode) {
    switch (mode) {
        case "countries": return countryWords;
        case "adults": return adultWords;
        case "celebrities": return celebritiesWords;
        case "jobs": return jobsWords;
        case "jugendwoerter": return jugendwoerter;
        case "normal":
        default: return normalWords;
    }
}

function App() {
    const [numPlayers, setNumPlayers] = useState(0);
    const [numImposters, setNumImposters] = useState(0);
    const [step, setStep] = useState(1); // 1-3 = Setup, 4 = Spiel
    const [wordList, setWordList] = useState([]);
    const [activeCard, setActiveCard] = useState(null); // { word, index } | null
    const [removingIndex, setRemovingIndex] = useState(null);
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [mode, setMode] = useState("normal");
    const [showInfo, setShowInfo] = useState(false);
    const [theme, setTheme] = useState("dark");
    const [showThemeOverlay, setShowThemeOverlay] = useState(false);
    const touchStartRef = useRef(null);

    const initializeGame = useCallback(() => {
        const selectedMode = mode === "random"
            ? MODES[Math.floor(Math.random() * MODES.length)]
            : mode;

        const items = getItemsByMode(selectedMode);
        const chosenItem = items[Math.floor(Math.random() * items.length)];
        const newWordList = Array(numPlayers).fill(chosenItem);
        const impostorIndexes = [];

        while (impostorIndexes.length < numImposters) {
            const randomIndex = Math.floor(Math.random() * numPlayers);
            if (!impostorIndexes.includes(randomIndex)) {
                impostorIndexes.push(randomIndex);
                newWordList[randomIndex] = "Imposter";
            }
        }

        setWordList(newWordList);
    }, [mode, numPlayers, numImposters]);

    useEffect(() => {
        if (step === 4) initializeGame();
    }, [step, initializeGame]);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const handleRevealWord = (index) => {
        setActiveCard({ word: wordList[index], index });
        setSwipeOffset(0);
    };

    const handleRemoveWord = (index) => {
        setActiveCard(null);
        setRemovingIndex(index);
        setTimeout(() => {
            setWordList(prev => prev.filter((_, i) => i !== index));
            setRemovingIndex(null);
        }, 350);
    };

    const handleTouchStart = (e) => {
        touchStartRef.current = e.touches[0].clientX;
        setSwipeOffset(0);
    };

    const handleTouchMove = (e) => {
        if (touchStartRef.current === null) return;
        setSwipeOffset(e.touches[0].clientX - touchStartRef.current);
    };

    const handleTouchEnd = () => {
        if (Math.abs(swipeOffset) > 90) {
            handleRemoveWord(activeCard.index);
        } else {
            setSwipeOffset(0);
        }
        touchStartRef.current = null;
    };

    const resetGame = () => {
        setStep(1);
        setNumPlayers(0);
        setNumImposters(0);
        setMode("normal");
    };

    const handleThemeChange = (selectedTheme) => {
        setTheme(selectedTheme);
        setShowThemeOverlay(false);
    };

    return (
        <div className="App">
            <button className="home-button" onClick={resetGame}>🏠</button>
            <button className="theme-button" onClick={() => setShowThemeOverlay(true)}>Theme wechseln</button>
            <button className="info-button" onClick={() => setShowInfo(true)}>ℹ️</button>

            {showInfo && (
                <div className="info-overlay">
                    <div className="info-content info-text">
                        <button className="close-button" onClick={() => setShowInfo(false)}>X</button>
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
                            <li>Starte das Spiel. Jeder Spieler sieht eine Karte mit einem Wort oder "Imposter".</li>
                            <li>Diskutiert und versucht herauszufinden, wer die Imposter sind.</li>
                            <li>Die Imposter versuchen, unentdeckt zu bleiben.</li>
                        </ul>
                    </div>
                </div>
            )}

            {activeCard && (
                <div className="card-overlay">
                    <div
                        className="card-reveal"
                        style={
                            swipeOffset !== 0
                                ? { transform: `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.03}deg)`, transition: "none" }
                                : {}
                        }
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <p className="card-reveal-word">{activeCard.word}</p>
                        <button className="card-done" onClick={() => handleRemoveWord(activeCard.index)}>✓</button>
                        <p className="card-swipe-hint">← wischen zum entfernen →</p>
                    </div>
                </div>
            )}

            {showThemeOverlay && (
                <div className="theme-overlay">
                    <div className="theme-content">
                        <button className="close-button" onClick={() => setShowThemeOverlay(false)}>X</button>
                        <h2>Wählen Sie ein Thema</h2>
                        <div className="theme-preview">
                            <div className="theme-option theme-dark" onClick={() => handleThemeChange("dark")}></div>
                            <div className="theme-option theme-light" onClick={() => handleThemeChange("light")}></div>
                            <div className="theme-option theme-pink" onClick={() => handleThemeChange("pink")}></div>
                            <div className="theme-option theme-blue" onClick={() => handleThemeChange("blue")}></div>
                        </div>
                    </div>
                </div>
            )}

            <header className="App-header">
                <h1>Word Guesser</h1>
                {step === 1 && (
                    <div>
                        <h2>Modus auswählen:</h2>
                        <div className="button-grid">
                            {[
                                { value: "normal", label: "Normal" },
                                { value: "countries", label: "Länder" },
                                { value: "adults", label: "18+" },
                                { value: "celebrities", label: "Berühmtheiten" },
                                { value: "jobs", label: "Berufe" },
                                { value: "jugendwoerter", label: "Jugendwörter" },
                                { value: "random", label: "Zufall" },
                            ].map(({ value, label }) => (
                                <button
                                    key={value}
                                    onClick={() => setMode(value)}
                                    className={mode === value ? "selected" : ""}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setStep(2)}>Weiter</button>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <h2>Anzahl der Spieler:</h2>
                        <div className="button-grid">
                            {Array.from({ length: 9 }, (_, i) => i + 3).map((i) => (
                                <button
                                    key={i}
                                    onClick={() => setNumPlayers(i)}
                                    className={numPlayers === i ? "selected" : ""}
                                >
                                    {i}
                                </button>
                            ))}
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
                            {Array.from({ length: 3 }, (_, i) => i + 1).map((i) => (
                                <button
                                    key={i}
                                    onClick={() => setNumImposters(i)}
                                    className={numImposters === i ? "selected" : ""}
                                >
                                    {i}
                                </button>
                            ))}
                            <input
                                type="number"
                                placeholder="Mehr als 3"
                                onChange={(e) => setNumImposters(Number(e.target.value))}
                                min="4"
                            />
                        </div>
                        <button
                            onClick={() => setStep(4)}
                            disabled={numImposters < 1 || numImposters >= numPlayers}
                        >
                            Spiel starten
                        </button>
                        <button onClick={() => setStep(2)}>Zurück</button>
                    </div>
                )}
                {step === 4 && (
                    <div className="game-info">
                        <p className="game-subtitle">Spiel gestartet mit {numPlayers} Spielern</p>
                        <div className="card-container">
                            {wordList.map((_, index) => (
                                <div
                                    className={`card ${removingIndex === index ? "removing" : ""}`}
                                    key={index}
                                    onClick={() => removingIndex !== index && handleRevealWord(index)}
                                >
                                    <span className="card-flip-icon">↩</span>
                                </div>
                            ))}
                            {wordList.length === 0 && (
                                <div style={{ marginTop: "20px" }}>
                                    <button onClick={resetGame}>Neues Spiel</button>
                                    <button onClick={initializeGame}>Spiel neu starten</button>
                                </div>
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
