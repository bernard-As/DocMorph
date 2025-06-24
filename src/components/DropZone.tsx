/**
 * File Drop Zone Component
 * Built by Montfort Assogba for DocMorph
 */

"use client";

import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
	CloudArrowUpIcon,
	DocumentIcon,
	ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { DropZoneProps } from "../types";

const DropZone: React.FC<DropZoneProps> = ({
	onFileSelect,
	acceptedTypes,
	maxSize,
	isProcessing = false,
}) => {
	const [error, setError] = useState<string | null>(null);
	const onDrop = useCallback(
		(acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
			setError(null);

			if (rejectedFiles.length > 0) {
				const rejection = rejectedFiles[0];
				if (rejection.errors.find((e) => e.code === "file-too-large")) {
					setError(
						`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`
					);
				} else if (
					rejection.errors.find((e) => e.code === "file-invalid-type")
				) {
					setError(
						"Invalid file type. Please select a supported document format."
					);
				} else {
					setError("File rejected. Please try again.");
				}
				return;
			}

			if (acceptedFiles.length > 0) {
				onFileSelect(acceptedFiles[0]);
			}
		},
		[onFileSelect, maxSize]
	);

	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject,
	} = useDropzone({
		onDrop,
		accept: acceptedTypes.reduce(
			(acc, type) => {
				acc[type] = [];
				return acc;
			},
			{} as Record<string, string[]>
		),
		maxSize,
		multiple: false,
		disabled: isProcessing,
	});

	const getDropZoneStyle = () => {
		let baseClasses =
			"relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ";

		if (isProcessing) {
			baseClasses += "border-gray-300 bg-gray-50 cursor-not-allowed ";
		} else if (isDragReject || error) {
			baseClasses += "border-red-400 bg-red-50 dark:bg-red-900/20 ";
		} else if (isDragAccept) {
			baseClasses += "border-green-400 bg-green-50 dark:bg-green-900/20 ";
		} else if (isDragActive) {
			baseClasses += "border-twitter-blue bg-blue-50 dark:bg-blue-900/20 ";
		} else {
			baseClasses +=
				"border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:border-twitter-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 ";
		}

		return baseClasses;
	};

	const formatFileSize = (size: number) => {
		if (size < 1024) return `${size} bytes`;
		if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
		return `${(size / (1024 * 1024)).toFixed(1)} MB`;
	};

	const getSupportedFormats = () => {
		return acceptedTypes
			.map((type) => type.split("/")[1] || type)
			.join(", ")
			.toUpperCase();
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="w-full">
			<div {...getRootProps()} className={getDropZoneStyle()}>
				<input {...getInputProps()} />

				<motion.div
					animate={{
						scale: isDragActive ? 1.05 : 1,
						rotate: isDragActive ? [0, -1, 1, 0] : 0,
					}}
					transition={{ duration: 0.3 }}
					className="flex flex-col items-center justify-center space-y-4">
					{isProcessing ? (
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-twitter-blue"></div>
					) : (
						<motion.div
							animate={{ y: isDragActive ? -5 : 0 }}
							transition={{ duration: 0.2 }}>
							{error ? (
								<ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
							) : (
								<CloudArrowUpIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
							)}
						</motion.div>
					)}

					<div className="text-center">
						{isProcessing ? (
							<p className="text-lg font-medium text-gray-600 dark:text-gray-300">
								Processing your file...
							</p>
						) : error ? (
							<div>
								<p className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
									{error}
								</p>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Try selecting a different file
								</p>
							</div>
						) : (
							<div>
								<p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
									{isDragActive
										? "Drop your file here"
										: "Drag & drop your document here"}
								</p>
								<p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
									or click to select a file
								</p>
								<div className="flex items-center justify-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
									<DocumentIcon className="h-4 w-4" />
									<span>Supports: {getSupportedFormats()}</span>
								</div>
								<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
									Max size: {formatFileSize(maxSize)}
								</p>
							</div>
						)}
					</div>
				</motion.div>

				{/* Glass effect overlay */}
				<div className="absolute inset-0 bg-glass dark:bg-glass-dark rounded-xl pointer-events-none"></div>
			</div>

			<AnimatePresence>
				{error && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
						<div className="flex items-center space-x-2">
							<ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
							<p className="text-sm text-red-700 dark:text-red-300">{error}</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default DropZone;
