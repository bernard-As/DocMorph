/**
 * Conversion History List Component
 * Built by Montfort Assogba for DocMorph
 */

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	ClockIcon,
	TrashIcon,
	DocumentIcon,
	DocumentTextIcon,
	GlobeAltIcon,
	ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useConversionHistory } from "../hooks/useConversionHistory";
import { SupportedFormat } from "../types";

const HistoryList: React.FC = () => {
	const { history, isLoading, removeFromHistory, clearHistory } =
		useConversionHistory();

	const getFormatIcon = (format: SupportedFormat) => {
		switch (format) {
			case "pdf":
				return <DocumentIcon className="h-5 w-5" />;
			case "docx":
				return <DocumentTextIcon className="h-5 w-5" />;
			case "html":
				return <GlobeAltIcon className="h-5 w-5" />;
			default:
				return <DocumentIcon className="h-5 w-5" />;
		}
	};

	const formatFileSize = (size: number) => {
		if (size < 1024) return `${size} B`;
		if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
		return `${(size / (1024 * 1024)).toFixed(1)} MB`;
	};

	const formatDate = (date: Date) => {
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffMinutes = Math.floor(diffMs / (1000 * 60));

		if (diffMinutes < 1) return "Just now";
		if (diffMinutes < 60) return `${diffMinutes}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;

		return date.toLocaleDateString();
	};

	if (isLoading) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6">
				<div className="flex items-center justify-center h-32">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-twitter-blue"></div>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-xl overflow-hidden">
			{/* Header */}
			<div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<ClockIcon className="h-6 w-6 text-gray-500" />
						<div>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
								Conversion History
							</h2>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								{history.length}{" "}
								{history.length === 1 ? "conversion" : "conversions"}
							</p>
						</div>
					</div>

					{history.length > 0 && (
						<motion.button
							onClick={clearHistory}
							className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}>
							<TrashIcon className="h-4 w-4" />
							<span className="text-sm">Clear All</span>
						</motion.button>
					)}
				</div>
			</div>

			{/* History List */}
			<div className="max-h-96 overflow-y-auto">
				<AnimatePresence>
					{history.length === 0 ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="p-8 text-center">
							<ClockIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
							<p className="text-gray-600 dark:text-gray-400 mb-2">
								No conversion history
							</p>
							<p className="text-sm text-gray-500 dark:text-gray-500">
								Your completed conversions will appear here
							</p>
						</motion.div>
					) : (
						history.map((item, index) => (
							<motion.div
								key={item.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 20 }}
								transition={{ delay: index * 0.05 }}
								className="border-b border-gray-200/50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
								<div className="p-4 flex items-center justify-between">
									<div className="flex items-center space-x-4 flex-1 min-w-0">
										{/* File Info */}
										<div className="flex items-center space-x-3">
											{getFormatIcon(item.inputFormat)}
											<ArrowRightIcon className="h-4 w-4 text-gray-400" />
											{getFormatIcon(item.outputFormat)}
										</div>

										<div className="flex-1 min-w-0">
											<p className="font-medium text-gray-900 dark:text-white truncate">
												{item.fileName}
											</p>
											<div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
												<span>
													{item.inputFormat.toUpperCase()} →{" "}
													{item.outputFormat.toUpperCase()}
												</span>
												<span>{formatFileSize(item.fileSize)}</span>
												<span>{formatDate(new Date(item.convertedAt))}</span>
											</div>
										</div>
									</div>

									{/* Actions */}
									<motion.button
										onClick={() => removeFromHistory(item.id)}
										className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										title="Remove from history">
										<TrashIcon className="h-4 w-4" />
									</motion.button>
								</div>
							</motion.div>
						))
					)}
				</AnimatePresence>
			</div>

			{/* Footer */}
			{history.length > 0 && (
				<div className="p-4 bg-gray-50/50 dark:bg-gray-700/30 border-t border-gray-200/50 dark:border-gray-700/50">
					<p className="text-xs text-gray-500 dark:text-gray-400 text-center">
						History is stored locally in your browser
					</p>
				</div>
			)}
		</motion.div>
	);
};

export default HistoryList;
