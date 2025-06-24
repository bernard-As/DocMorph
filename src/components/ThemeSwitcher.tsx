/**
 * Theme Switcher Component
 * Built by Montfort Assogba for DocMorph
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
	SunIcon,
	MoonIcon,
	ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { useTheme, Theme } from "../hooks/useTheme";

const ThemeSwitcher: React.FC = () => {
	const { theme, setTheme } = useTheme();

	const themes: { value: Theme; icon: React.ReactNode; label: string }[] = [
		{
			value: "light",
			icon: <SunIcon className="h-5 w-5" />,
			label: "Light",
		},
		{
			value: "dark",
			icon: <MoonIcon className="h-5 w-5" />,
			label: "Dark",
		},
		{
			value: "system",
			icon: <ComputerDesktopIcon className="h-5 w-5" />,
			label: "System",
		},
	];

	return (
		<div className="relative">
			<div className="flex items-center bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-1">
				{themes.map((themeOption) => (
					<motion.button
						key={themeOption.value}
						onClick={() => setTheme(themeOption.value)}
						className={`relative flex items-center justify-center p-2 rounded-md transition-all duration-200 ${
							theme === themeOption.value
								? "text-white"
								: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
						}`}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						title={`Switch to ${themeOption.label} mode`}>
						{theme === themeOption.value && (
							<motion.div
								layoutId="activeTheme"
								className="absolute inset-0 bg-twitter-blue rounded-md"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.2 }}
							/>
						)}
						<span className="relative z-10">{themeOption.icon}</span>
					</motion.button>
				))}
			</div>
		</div>
	);
};

export default ThemeSwitcher;
