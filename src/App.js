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
    const [numPlayers, setNumPlayers] = useState(() => Number(localStorage.getItem("numPlayers")) || 0);
    const [numImposters, setNumImposters] = useState(() => Number(localStorage.getItem("numImposters")) || 0);
    const [step, setStep] = useState(1); // 1 = Setup, 4 = Spiel
    const [wordList, setWordList] = useState([]);
    const [currentWord, setCurrentWord] = useState(null);
    const [wordRevealed, setWordRevealed] = useState(false);
    const [cardStage, setCardStage] = useState(null); // null | "ready" | "revealed"
    const [activeCard, setActiveCard] = useState(null); // { word, index } | null
    const [removingIndex, setRemovingIndex] = useState(null);
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [showConfirmReset, setShowConfirmReset] = useState(false);
    const [mode, setMode] = useState(() => localStorage.getItem("mode") || "normal");
    const [hintMode, setHintMode] = useState(() => localStorage.getItem("hintMode") === "true");
    const [showInfo, setShowInfo] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
    const [showThemeOverlay, setShowThemeOverlay] = useState(false);
    const touchStartRef = useRef(null);

    const canStart = numPlayers >= 3 && numImposters >= 1 && numImposters < numPlayers;

    const initializeGame = useCallback(() => {
        const selectedMode = mode === "random"
            ? MODES[Math.floor(Math.random() * MODES.length)]
            : mode;

        const items = getItemsByMode(selectedMode);
        const chosenItem = items[Math.floor(Math.random() * items.length)];
        const newWordList = Array(numPlayers).fill(null).map(() => ({ text: chosenItem.word, hint: null }));
        const impostorIndexes = [];

        while (impostorIndexes.length < numImposters) {
            const randomIndex = Math.floor(Math.random() * numPlayers);
            if (!impostorIndexes.includes(randomIndex)) {
                impostorIndexes.push(randomIndex);
                const hint = hintMode && chosenItem.hints?.length
                    ? chosenItem.hints[Math.floor(Math.random() * chosenItem.hints.length)]
                    : null;
                newWordList[randomIndex] = { text: "Imposter", hint };
            }
        }

        setCurrentWord(chosenItem.word);
        setWordRevealed(false);
        setWordList(newWordList);
        setActiveCard(null);
        setCardStage(null);
    }, [mode, numPlayers, numImposters, hintMode]);

    useEffect(() => {
        if (step === 4) initializeGame();
    }, [step, initializeGame]);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    // Reset imposter count if it becomes invalid after player count change
    useEffect(() => {
        if (numImposters >= numPlayers) setNumImposters(0);
    }, [numPlayers, numImposters]);

    const handleCardClick = (index) => {
        if (removingIndex === index) return;
        setActiveCard({ word: wordList[index].text, hint: wordList[index].hint, index });
        setCardStage("ready");
        setSwipeOffset(0);
    };

    const handleReveal = () => {
        setCardStage("revealed");
    };

    const handleRemoveWord = (index) => {
        setActiveCard(null);
        setCardStage(null);
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

    const handleHomeClick = () => {
        if (step === 4) {
            setShowConfirmReset(true);
        } else {
            resetGame();
        }
    };

    const resetGame = () => {
        setStep(1);
        setNumPlayers(0);
        setNumImposters(0);
        setMode("normal");
        setActiveCard(null);
        setCardStage(null);
        setWordRevealed(false);
        setShowConfirmReset(false);
    };

    const handleStartGame = () => {
        localStorage.setItem("mode", mode);
        localStorage.setItem("numPlayers", String(numPlayers));
        localStorage.setItem("numImposters", String(numImposters));
        localStorage.setItem("hintMode", String(hintMode));
        setStep(4);
    };

    const handleThemeChange = (selectedTheme) => {
        localStorage.setItem("theme", selectedTheme);
        setTheme(selectedTheme);
        setShowThemeOverlay(false);
    };

    return (
        <div className="App">
            <button className="home-button" onClick={handleHomeClick}>🏠</button>
            <button className="theme-button" onClick={() => setShowThemeOverlay(true)}>Theme wechseln</button>
            <button className="info-button" onClick={() => setShowInfo(true)}>ℹ️</button>

            {/* Info overlay */}
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

            {/* Confirm reset overlay */}
            {showConfirmReset && (
                <div className="info-overlay">
                    <div className="info-content confirm-content">
                        <p className="confirm-title">Spiel beenden?</p>
                        <div className="confirm-buttons">
                            <button className="confirm-yes" onClick={resetGame}>Ja, beenden</button>
                            <button onClick={() => setShowConfirmReset(false)}>Weiter spielen</button>
                        </div>
                    </div>
                </div>
            )}

            {/* "Bereit?" screen */}
            {cardStage === "ready" && (
                <div className="card-overlay" onClick={handleReveal}>
                    <div className="card-ready">
                        <p className="card-ready-title">Bereit?</p>
                        <p className="card-ready-hint">Tippen zum aufdecken</p>
                    </div>
                </div>
            )}

            {/* Card reveal */}
            {cardStage === "revealed" && activeCard && (
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
                        {activeCard.hint && (
                            <p className="card-reveal-hint">Hinweis: {activeCard.hint}</p>
                        )}
                        <button className="card-done" onClick={() => handleRemoveWord(activeCard.index)}>✓</button>
                        <p className="card-swipe-hint">← wischen zum entfernen →</p>
                    </div>
                </div>
            )}

            {/* Theme overlay */}
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

                {/* Single setup screen */}
                {step === 1 && (
                    <div className="setup-screen">
                        <section className="setup-section">
                            <h2>Modus</h2>
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
                        </section>

                        <section className="setup-section">
                            <h2>Spieler</h2>
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
                                    placeholder="> 11"
                                    onChange={(e) => setNumPlayers(Number(e.target.value))}
                                    min="12"
                                />
                            </div>
                        </section>

                        <section className="setup-section">
                            <h2>Imposter</h2>
                            <div className="button-grid">
                                {Array.from({ length: 3 }, (_, i) => i + 1).map((i) => (
                                    <button
                                        key={i}
                                        onClick={() => setNumImposters(i)}
                                        className={numImposters === i ? "selected" : ""}
                                        disabled={numPlayers > 0 && i >= numPlayers}
                                    >
                                        {i}
                                    </button>
                                ))}
                                <input
                                    type="number"
                                    placeholder="> 3"
                                    onChange={(e) => setNumImposters(Number(e.target.value))}
                                    min="4"
                                />
                            </div>
                        </section>

                        <section className="setup-section">
                            <h2>Optionen</h2>
                            <div className="option-row" onClick={() => setHintMode(prev => !prev)}>
                                <span className="option-label">Imposter-Hinweis</span>
                                <span className={`option-toggle${hintMode ? " on" : ""}`} />
                            </div>
                        </section>

                        <button
                            className="start-button"
                            onClick={handleStartGame}
                            disabled={!canStart}
                        >
                            Spiel starten
                        </button>
                    </div>
                )}

                {/* Game screen */}
                {step === 4 && (
                    <div className="game-info">
                        <div className="game-header">
                            <p className="game-subtitle">
                                {wordList.length} von {numPlayers} verbleibend
                            </p>
                            <button className="restart-button" onClick={initializeGame}>↺</button>
                        </div>
                        <div className="card-container">
                            {wordList.map((_, index) => (
                                <div
                                    className={`card ${removingIndex === index ? "removing" : ""}`}
                                    key={index}
                                    onClick={() => handleCardClick(index)}
                                >
                                    <span className="card-flip-icon">↩</span>
                                </div>
                            ))}
                            {wordList.length === 0 && (
                                <div className="game-end">
                                    {wordRevealed ? (
                                        <>
                                            <p className="game-end-label">Das Wort war</p>
                                            <p className="game-end-word">{currentWord}</p>
                                            <div className="game-end-buttons">
                                                <button onClick={resetGame}>Neues Spiel</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="game-end-label">Alle Karten aufgedeckt</p>
                                            <div className="game-end-buttons">
                                                <button onClick={resetGame}>Neues Spiel</button>
                                                <button onClick={initializeGame}>Nochmal</button>
                                                <button className="reveal-word-button" onClick={() => setWordRevealed(true)}>Wort aufdecken</button>
                                            </div>
                                        </>
                                    )}
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
