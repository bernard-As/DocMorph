/**
 * Output Preview Component
 * Built by Montfort Assogba for DocMorph
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
	DocumentIcon,
	EyeIcon,
	ArrowDownTrayIcon,
	ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { PreviewProps } from "../types";

const OutputPreview: React.FC<PreviewProps> = ({
	file,
	blob,
	format,
	isLoading = false,
}) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [previewContent, setPreviewContent] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const generatePreview = useCallback(async () => {
		try {
			setError(null);
			setPreviewContent(null);
			setPreviewUrl(null);

			const targetBlob = blob || file;
			if (!targetBlob) return;

			switch (format) {
				case "pdf":
					// For PDF, create object URL for iframe
					const pdfUrl = URL.createObjectURL(targetBlob);
					setPreviewUrl(pdfUrl);
					break;

				case "html":
					// For HTML, read as text and display
					const htmlText = await targetBlob.text();
					setPreviewContent(htmlText);
					break;

				case "txt":
					// For text, read and display
					const textContent = await targetBlob.text();
					setPreviewContent(textContent);
					break;

				case "docx":
					// DOCX can't be previewed directly in browser
					setError("DOCX preview not available. Download the file to view.");
					break;

				default:
					setError("Preview not available for this format.");
			}
		} catch (err) {
			setError("Failed to generate preview");
			console.error("Preview generation error:", err);
		}
	}, [blob, file, format]);

	useEffect(() => {
		if (blob || file) {
			generatePreview();
		}

		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [generatePreview, blob, file, previewUrl]);

	const downloadFile = () => {
		const targetBlob = blob || file;
		if (!targetBlob) return;

		const url = URL.createObjectURL(targetBlob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `converted_document.${format}`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const formatFileSize = (size: number) => {
		if (size < 1024) return `${size} B`;
		if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
		return `${(size / (1024 * 1024)).toFixed(1)} MB`;
	};

	if (isLoading) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-twitter-blue mx-auto mb-4"></div>
						<p className="text-gray-600 dark:text-gray-400">
							Generating preview...
						</p>
					</div>
				</div>
			</motion.div>
		);
	}

	if (!file && !blob) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<DocumentIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
						<p className="text-gray-600 dark:text-gray-400">
							No file to preview
						</p>
					</div>
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
			<div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<EyeIcon className="h-5 w-5 text-gray-500" />
						<div>
							<h3 className="font-medium text-gray-900 dark:text-white">
								Preview ({format.toUpperCase()})
							</h3>
							{(file || blob) && (
								<p className="text-sm text-gray-600 dark:text-gray-400">
									{file?.name || "Converted document"} •{" "}
									{formatFileSize((blob || file)?.size || 0)}
								</p>
							)}
						</div>
					</div>

					<motion.button
						onClick={downloadFile}
						className="flex items-center space-x-2 px-3 py-2 bg-twitter-blue text-white text-sm rounded-lg hover:bg-twitter-darkBlue transition-colors"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}>
						<ArrowDownTrayIcon className="h-4 w-4" />
						<span>Download</span>
					</motion.button>
				</div>
			</div>

			{/* Preview Content */}
			<div className="p-4">
				{error ? (
					<div className="flex items-center justify-center h-64">
						<div className="text-center">
							<ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
							<p className="text-gray-600 dark:text-gray-400">{error}</p>
						</div>
					</div>
				) : format === "pdf" && previewUrl ? (
					<div className="h-96 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
						<iframe
							src={previewUrl}
							className="w-full h-full"
							title="PDF Preview"
						/>
					</div>
				) : format === "html" && previewContent ? (
					<div className="space-y-4">
						{/* HTML Preview */}
						<div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
							<div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 border-b border-gray-200 dark:border-gray-600">
								<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
									Rendered Preview
								</span>
							</div>
							<div
								className="p-4 h-64 overflow-auto bg-white dark:bg-gray-800"
								dangerouslySetInnerHTML={{ __html: previewContent }}
							/>
						</div>

						{/* HTML Source */}
						<div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
							<div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 border-b border-gray-200 dark:border-gray-600">
								<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
									HTML Source
								</span>
							</div>
							<pre className="p-4 h-32 overflow-auto bg-gray-900 text-green-400 text-sm">
								<code>{previewContent}</code>
							</pre>
						</div>
					</div>
				) : format === "txt" && previewContent ? (
					<div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
						<div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 border-b border-gray-200 dark:border-gray-600">
							<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
								Text Content
							</span>
						</div>
						<pre className="p-4 h-64 overflow-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm whitespace-pre-wrap">
							{previewContent}
						</pre>
					</div>
				) : (
					<div className="flex items-center justify-center h-64">
						<div className="text-center">
							<DocumentIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
							<p className="text-gray-600 dark:text-gray-400">
								Preview not available for this format
							</p>
							<p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
								Click download to view the converted file
							</p>
						</div>
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default OutputPreview;
