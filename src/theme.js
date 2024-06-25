const themes = {
    dark: {
        "--bg-color": "#1a1a1a",
        "--text-color": "#ffffff",
        "--button-bg-color": "#333",
        "--button-hover-bg-color": "#555",
        "--card-bg-color": "#333",
        "--input-border-color": "#555",
        "--footer-bg-color": "#1a1a1a",
        "--footer-text-color": "#888",
        "--info-content-bg-color": "#2c2c2c",
    },
    light: {
        "--bg-color": "#ffffff",
        "--text-color": "#000000",
        "--button-bg-color": "#e0e0e0",
        "--button-hover-bg-color": "#d5d5d5",
        "--card-bg-color": "#f0f0f0",
        "--input-border-color": "#cccccc",
        "--footer-bg-color": "#ffffff",
        "--footer-text-color": "#555555",
        "--info-content-bg-color": "#f7f7f7",
    },
    pink: {
        "--bg-color": "#ffe4e1",
        "--text-color": "#000000",
        "--button-bg-color": "#ffb6c1",
        "--button-hover-bg-color": "#ffa6b1",
        "--card-bg-color": "#ffcccc",
        "--input-border-color": "#ff9999",
        "--footer-bg-color": "#ffe4e1",
        "--footer-text-color": "#ff6666",
        "--info-content-bg-color": "#ffd1dc",
    },
    blue: {
        "--bg-color": "#add8e6",
        "--text-color": "#000000",
        "--button-bg-color": "#87cefa",
        "--button-hover-bg-color": "#4682b4",
        "--card-bg-color": "#b0e0e6",
        "--input-border-color": "#5f9ea0",
        "--footer-bg-color": "#add8e6",
        "--footer-text-color": "#4682b4",
        "--info-content-bg-color": "#cae4f1",
    },
};

export const applyTheme = (theme) => {
    const themeProperties = themes[theme];
    if (themeProperties) {
        Object.keys(themeProperties).forEach((property) => {
            document.documentElement.style.setProperty(property, themeProperties[property]);
        });
    }
};
