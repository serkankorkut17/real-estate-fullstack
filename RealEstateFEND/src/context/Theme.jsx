import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		const storedDarkMode = localStorage.getItem("darkMode");
		if (storedDarkMode) {
			const isDark = storedDarkMode === "true";
			setDarkMode(isDark);
			document.documentElement.classList.toggle("dark", isDark);
		}
	}, []);

	const toggleDarkMode = () => {
		const newDarkMode = !darkMode;
		setDarkMode(newDarkMode);
		localStorage.setItem("darkMode", newDarkMode);
		document.documentElement.classList.toggle("dark", newDarkMode);
	};

	return (
		<ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
