/**
 * Core types for DocMorph - Document Conversion Application
 * Built by Montfort Assogba
 */

export type SupportedFormat = "pdf" | "docx" | "html" | "txt";

export interface ConversionJob {
	id: string;
	inputFile: File;
	inputFormat: SupportedFormat;
	outputFormat: SupportedFormat;
	status: "pending" | "processing" | "completed" | "error";
	progress: number;
	createdAt: Date;
	completedAt?: Date;
	outputFileName?: string;
	outputBlob?: Blob;
	error?: string;
}

export interface ConversionHistory {
	id: string;
	fileName: string;
	inputFormat: SupportedFormat;
	outputFormat: SupportedFormat;
	fileSize: number;
	convertedAt: Date;
	downloadUrl?: string;
}

export interface ConversionTool {
	id: string;
	name: string;
	description: string;
	inputFormat: SupportedFormat;
	outputFormat: SupportedFormat;
	icon: string;
	isAvailable: boolean;
	maxFileSize: number; // in bytes
}

export interface ThemeMode {
	mode: "light" | "dark";
}

export interface DropZoneProps {
	onFileSelect: (file: File) => void;
	acceptedTypes: string[];
	maxSize: number;
	isProcessing?: boolean;
}

export interface PreviewProps {
	file?: File;
	blob?: Blob;
	format: SupportedFormat;
	isLoading?: boolean;
}

// HTML2PDF types (since @types/html2pdf.js doesn't exist)
declare global {
	interface Window {
		html2pdf: unknown;
	}
}
