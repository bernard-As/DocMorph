/**
 * Custom hook for theme management
 * Built by Montfort Assogba for DocMorph
 */

import { useState, useEffect, useCallback } from "react";
import { storageService } from "../utils/storage";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
	const [theme, setTheme] = useState<Theme>("system");
	const [isDark, setIsDark] = useState(false);

	// Define updateDarkMode first
	const updateDarkMode = useCallback((themeMode: Theme) => {
		let shouldBeDark = false;

		if (themeMode === "dark") {
			shouldBeDark = true;
		} else if (themeMode === "light") {
			shouldBeDark = false;
		} else {
			// system
			shouldBeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		}

		setIsDark(shouldBeDark);

		// Update document class
		if (shouldBeDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, []);

	// Initialize theme from storage and system preference
	useEffect(() => {
		const initTheme = async () => {
			try {
				const preferences = await storageService.getPreferences();
				const savedTheme = (preferences.theme as Theme) || "system";
				setTheme(savedTheme);
				updateDarkMode(savedTheme);
			} catch (error) {
				console.warn("Failed to load theme preference:", error);
				updateDarkMode("system");
			}
		};

		initTheme();
	}, [updateDarkMode]);

	// Listen to system theme changes
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = () => {
			if (theme === "system") {
				updateDarkMode("system");
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [theme, updateDarkMode]);

	const setThemeMode = useCallback(
		async (newTheme: Theme) => {
			setTheme(newTheme);
			updateDarkMode(newTheme);

			try {
				const preferences = await storageService.getPreferences();
				await storageService.savePreferences({
					...preferences,
					theme: newTheme,
				});
			} catch (error) {
				console.warn("Failed to save theme preference:", error);
			}
		},
		[updateDarkMode]
	);

	const toggleTheme = useCallback(() => {
		const newTheme = isDark ? "light" : "dark";
		setThemeMode(newTheme);
	}, [isDark, setThemeMode]);

	return {
		theme,
		isDark,
		setTheme: setThemeMode,
		toggleTheme,
	};
}
