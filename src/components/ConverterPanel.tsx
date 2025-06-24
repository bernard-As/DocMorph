/**
 * Conversion Tools Panel Component
 * Built by Montfort Assogba for DocMorph
 */

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	ArrowRightIcon,
	DocumentTextIcon,
	DocumentIcon,
	GlobeAltIcon,
	PlayIcon,
	CheckCircleIcon,
	XCircleIcon,
	ClockIcon,
} from "@heroicons/react/24/outline";
import { useConverter } from "../hooks/useConverter";
import { ConversionTool, SupportedFormat } from "../types";
import DropZone from "./DropZone";

const ConverterPanel: React.FC = () => {
	const {
		jobs,
		isProcessing,
		startConversion,
		downloadResult,
		cancelJob,
		getSupportedTools,
	} = useConverter();
	const [selectedTool, setSelectedTool] = useState<ConversionTool | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const tools = getSupportedTools();

	const getFormatIcon = (format: SupportedFormat) => {
		switch (format) {
			case "pdf":
				return <DocumentIcon className="h-6 w-6" />;
			case "docx":
				return <DocumentTextIcon className="h-6 w-6" />;
			case "html":
				return <GlobeAltIcon className="h-6 w-6" />;
			default:
				return <DocumentIcon className="h-6 w-6" />;
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
			case "error":
				return <XCircleIcon className="h-5 w-5 text-red-500" />;
			case "processing":
				return <ClockIcon className="h-5 w-5 text-blue-500 animate-spin" />;
			default:
				return <ClockIcon className="h-5 w-5 text-gray-400" />;
		}
	};

	const handleFileSelect = (file: File) => {
		setSelectedFile(file);
	};

	const handleConvert = async () => {
		if (!selectedFile || !selectedTool) return;

		try {
			await startConversion(selectedFile, selectedTool.outputFormat);
			setSelectedFile(null);
		} catch (error) {
			console.error("Conversion failed:", error);
			// You might want to show a toast notification here
		}
	};

	const formatFileSize = (size: number) => {
		if (size < 1024) return `${size} B`;
		if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
		return `${(size / (1024 * 1024)).toFixed(1)} MB`;
	};

	const getAcceptedTypes = (tool: ConversionTool | null) => {
		if (!tool) return ["application/pdf", ".docx", "text/html", "text/plain"];

		switch (tool.inputFormat) {
			case "pdf":
				return ["application/pdf"];
			case "docx":
				return [
					".docx",
					"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				];
			case "html":
				return ["text/html", ".html", ".htm"];
			case "txt":
				return ["text/plain", ".txt"];
			default:
				return ["*/*"];
		}
	};

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6">
			{/* Tool Selection */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
					Choose Conversion Tool
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{tools.map((tool) => (
						<motion.button
							key={tool.id}
							onClick={() => setSelectedTool(tool)}
							className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
								selectedTool?.id === tool.id
									? "border-twitter-blue bg-blue-50 dark:bg-blue-900/30"
									: "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-twitter-blue hover:bg-blue-50 dark:hover:bg-blue-900/20"
							}`}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}>
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center space-x-3">
									{getFormatIcon(tool.inputFormat)}
									<ArrowRightIcon className="h-4 w-4 text-gray-400" />
									{getFormatIcon(tool.outputFormat)}
								</div>
								<span className="text-2xl">{tool.icon}</span>
							</div>
							<h3 className="font-medium text-gray-900 dark:text-white mb-1">
								{tool.name}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								{tool.description}
							</p>
						</motion.button>
					))}
				</div>
			</motion.div>

			{/* File Upload */}
			<AnimatePresence>
				{selectedTool && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							Upload {selectedTool.inputFormat.toUpperCase()} File
						</h3>

						<DropZone
							onFileSelect={handleFileSelect}
							acceptedTypes={getAcceptedTypes(selectedTool)}
							maxSize={selectedTool.maxFileSize}
							isProcessing={isProcessing}
						/>

						{selectedFile && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										{getFormatIcon(selectedTool.inputFormat)}
										<div>
											<p className="font-medium text-gray-900 dark:text-white">
												{selectedFile.name}
											</p>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												{formatFileSize(selectedFile.size)}
											</p>
										</div>
									</div>

									<motion.button
										onClick={handleConvert}
										disabled={isProcessing}
										className="flex items-center space-x-2 px-4 py-2 bg-twitter-blue text-white rounded-lg hover:bg-twitter-darkBlue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}>
										<PlayIcon className="h-4 w-4" />
										<span>Convert</span>
									</motion.button>
								</div>
							</motion.div>
						)}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Conversion Jobs */}
			<AnimatePresence>
				{jobs.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							Conversion Jobs
						</h3>

						<div className="space-y-3">
							{jobs.map((job) => (
								<motion.div
									key={job.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
									<div className="flex items-center space-x-3">
										{getStatusIcon(job.status)}
										<div>
											<p className="font-medium text-gray-900 dark:text-white">
												{job.inputFile.name}
											</p>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												{job.inputFormat.toUpperCase()} →{" "}
												{job.outputFormat.toUpperCase()}
											</p>
										</div>
									</div>

									<div className="flex items-center space-x-3">
										{job.status === "processing" && (
											<div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
												<div
													className="bg-twitter-blue h-2 rounded-full transition-all duration-300"
													style={{ width: `${job.progress}%` }}
												/>
											</div>
										)}

										{job.status === "completed" && (
											<motion.button
												onClick={() => downloadResult(job.id)}
												className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}>
												Download
											</motion.button>
										)}

										{job.status === "processing" && (
											<motion.button
												onClick={() => cancelJob(job.id)}
												className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}>
												Cancel
											</motion.button>
										)}
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ConverterPanel;
