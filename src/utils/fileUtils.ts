/**
 * Document Conversion Utilities
 * Built by Montfort Assogba for DocMorph
 */

import { SupportedFormat } from "../types";

// File size limit: 10MB
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Validates if a file can be processed
 */
export function validateFile(
	file: File,
	expectedFormat?: SupportedFormat
): boolean {
	if (file.size > MAX_FILE_SIZE) {
		throw new Error(
			`File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
		);
	}

	if (expectedFormat) {
		const extension = file.name.split(".").pop()?.toLowerCase();
		if (extension !== expectedFormat) {
			throw new Error(`Expected ${expectedFormat} file, got ${extension}`);
		}
	}

	return true;
}

/**
 * Generates a unique job ID
 */
export function generateJobId(): string {
	return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Gets file extension from filename
 */
export function getFileExtension(filename: string): string {
	return filename.split(".").pop()?.toLowerCase() || "";
}

/**
 * Detects file format from file
 */
export function detectFileFormat(file: File): SupportedFormat {
	const extension = getFileExtension(file.name);

	switch (extension) {
		case "pdf":
			return "pdf";
		case "docx":
			return "docx";
		case "html":
		case "htm":
			return "html";
		case "txt":
			return "txt";
		default:
			throw new Error(`Unsupported file format: ${extension}`);
	}
}

/**
 * Reads file as ArrayBuffer
 */
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as ArrayBuffer);
		reader.onerror = () => reject(new Error("Failed to read file"));
		reader.readAsArrayBuffer(file);
	});
}

/**
 * Reads file as text
 */
export function readFileAsText(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(new Error("Failed to read file"));
		reader.readAsText(file);
	});
}

/**
 * Creates a download link for a blob
 */
export function createDownloadLink(blob: Blob): string {
	return URL.createObjectURL(blob);
}

/**
 * Downloads a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
	const url = createDownloadLink(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

/**
 * Generates output filename based on input and conversion type
 */
export function generateOutputFilename(
	inputFilename: string,
	outputFormat: SupportedFormat
): string {
	const baseName = inputFilename.replace(/\.[^/.]+$/, "");
	const timestamp = new Date().toISOString().slice(0, 16).replace(/[:-]/g, "");
	return `${baseName}_converted_${timestamp}.${outputFormat}`;
}
