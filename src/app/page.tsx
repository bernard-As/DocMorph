/**
 * DocMorph - Professional Document Converter
 * Built by Montfort Assogba
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	DocumentArrowUpIcon,
	SparklesIcon,
	ShieldCheckIcon,
	BoltIcon,
} from "@heroicons/react/24/outline";
import ConverterPanel from "../components/ConverterPanel";
import HistoryList from "../components/HistoryList";
import ThemeSwitcher from "../components/ThemeSwitcher";
import Footer from "../components/Footer";

export default function Home() {
	const [activeTab, setActiveTab] = useState<"converter" | "history">(
		"converter"
	);

	const features = [
		{
			icon: <ShieldCheckIcon className="h-6 w-6" />,
			title: "Privacy First",
			description:
				"All conversions happen in your browser. No files uploaded to servers.",
		},
		{
			icon: <BoltIcon className="h-6 w-6" />,
			title: "Lightning Fast",
			description:
				"Client-side conversion with instant results. No waiting for uploads.",
		},
		{
			icon: <SparklesIcon className="h-6 w-6" />,
			title: "Modern Interface",
			description: "Beautiful, responsive design that works on all devices.",
		},
	];

	return (
		<div className="min-h-screen">
			{/* Background Elements */}
			<div className="fixed inset-0 -z-10">
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI5LCAxNjEsIDI0MiwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
				<div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
			</div>

			{/* Header */}
			<header className="relative z-10 py-6 px-4">
				<div className="max-w-6xl mx-auto flex items-center justify-between">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className="flex items-center space-x-3">
						<div className="p-2 bg-twitter-blue rounded-xl">
							<DocumentArrowUpIcon className="h-8 w-8 text-white" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
								DocMorph
							</h1>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								by Montfort Assogba
							</p>
						</div>
					</motion.div>

					<ThemeSwitcher />
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative z-10 py-12 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}>
						<h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
							Professional
							<span className="bg-gradient-to-r from-twitter-blue to-purple-600 bg-clip-text text-transparent">
								{" "}
								Document{" "}
							</span>
							Conversion
						</h2>

						<p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
							Convert PDFs, Word documents, and HTML files entirely in your
							browser. No uploads, no waiting, complete privacy.
						</p>

						{/* Features */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: 0.8 }}
							className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-12">
							{features.map((feature, index) => (
								<motion.div
									key={feature.title}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 + index * 0.1 }}
									className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl">
									<div className="text-twitter-blue mb-3">{feature.icon}</div>
									<h3 className="font-semibold text-gray-900 dark:text-white mb-2">
										{feature.title}
									</h3>
									<p className="text-gray-600 dark:text-gray-400 text-sm">
										{feature.description}
									</p>
								</motion.div>
							))}
						</motion.div>
					</motion.div>
				</div>
			</section>

			{/* Main Content */}
			<main className="relative z-10 py-8 px-4">
				<div className="max-w-6xl mx-auto">
					{/* Tab Navigation */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
						className="flex justify-center mb-8">
						<div className="flex bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-1">
							<button
								onClick={() => setActiveTab("converter")}
								className={`px-6 py-3 rounded-lg font-medium transition-all ${
									activeTab === "converter"
										? "bg-twitter-blue text-white shadow-lg"
										: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
								}`}>
								Converter
							</button>
							<button
								onClick={() => setActiveTab("history")}
								className={`px-6 py-3 rounded-lg font-medium transition-all ${
									activeTab === "history"
										? "bg-twitter-blue text-white shadow-lg"
										: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
								}`}>
								History
							</button>
						</div>
					</motion.div>

					{/* Tab Content */}
					<motion.div
						key={activeTab}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.3 }}>
						{activeTab === "converter" ? (
							<ConverterPanel />
						) : (
							<div className="max-w-4xl mx-auto">
								<HistoryList />
							</div>
						)}
					</motion.div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
