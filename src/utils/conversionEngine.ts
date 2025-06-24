/**
 * Main Conversion Engine for DocMorph
 * Built by Montfort Assogba
 */

import { ConversionJob, SupportedFormat } from "../types";
import {
	validateFile,
	generateJobId,
	generateOutputFilename,
} from "./fileUtils";
import { extractTextFromPDF, textToPDF } from "./pdfUtils";
import { docxToHTML, docxToText, htmlToDocx, textToDocx } from "./docxUtils";
import { htmlToPDF, htmlFileToPDF, textToHTML } from "./htmlUtils";

export class ConversionEngine {
	private jobs: Map<string, ConversionJob> = new Map();
	private progressCallbacks: Map<string, (progress: number) => void> =
		new Map();

	/**
	 * Starts a conversion job
	 */
	async startConversion(
		file: File,
		outputFormat: SupportedFormat,
		onProgress?: (progress: number) => void
	): Promise<string> {
		const jobId = generateJobId();

		try {
			validateFile(file);

			const inputFormat = this.detectFormat(file);
			const job: ConversionJob = {
				id: jobId,
				inputFile: file,
				inputFormat,
				outputFormat,
				status: "pending",
				progress: 0,
				createdAt: new Date(),
			};

			this.jobs.set(jobId, job);

			if (onProgress) {
				this.progressCallbacks.set(jobId, onProgress);
			}

			// Start conversion in background
			this.performConversion(jobId);

			return jobId;
		} catch (error) {
			throw new Error(
				`Failed to start conversion: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Gets conversion job status
	 */
	getJob(jobId: string): ConversionJob | undefined {
		return this.jobs.get(jobId);
	}

	/**
	 * Gets all jobs
	 */
	getAllJobs(): ConversionJob[] {
		return Array.from(this.jobs.values());
	}

	/**
	 * Cancels a conversion job
	 */
	cancelJob(jobId: string): boolean {
		const job = this.jobs.get(jobId);
		if (job && job.status === "processing") {
			job.status = "error";
			job.error = "Cancelled by user";
			return true;
		}
		return false;
	}

	/**
	 * Detects file format from file extension
	 */
	private detectFormat(file: File): SupportedFormat {
		const extension = file.name.split(".").pop()?.toLowerCase();

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
	 * Updates job progress
	 */
	private updateProgress(jobId: string, progress: number): void {
		const job = this.jobs.get(jobId);
		if (job) {
			job.progress = progress;
			const callback = this.progressCallbacks.get(jobId);
			if (callback) {
				callback(progress);
			}
		}
	}

	/**
	 * Performs the actual conversion
	 */
	private async performConversion(jobId: string): Promise<void> {
		const job = this.jobs.get(jobId);
		if (!job) return;

		console.log(`Starting conversion for job ${jobId}:`, {
			inputFormat: job.inputFormat,
			outputFormat: job.outputFormat,
			fileName: job.inputFile.name,
			fileSize: job.inputFile.size,
		});

		try {
			job.status = "processing";
			this.updateProgress(jobId, 10);

			const { inputFile, inputFormat, outputFormat } = job;
			let outputBlob: Blob;

			// Route to appropriate conversion method
			this.updateProgress(jobId, 30);

			if (inputFormat === outputFormat) {
				console.log(`No conversion needed for ${jobId}`);
				// No conversion needed, just copy the file
				outputBlob = new Blob([await inputFile.arrayBuffer()], {
					type: inputFile.type,
				});
			} else {
				console.log(
					`Converting ${inputFormat} to ${outputFormat} for job ${jobId}`
				);
				outputBlob = await this.convertFile(
					inputFile,
					inputFormat,
					outputFormat,
					jobId
				);
			}

			this.updateProgress(jobId, 90);

			// Generate output filename
			const outputFileName = generateOutputFilename(
				inputFile.name,
				outputFormat
			);

			job.status = "completed";
			job.progress = 100;
			job.completedAt = new Date();
			job.outputBlob = outputBlob;
			job.outputFileName = outputFileName;

			console.log(`Conversion completed for job ${jobId}:`, {
				outputFileName,
				outputSize: outputBlob.size,
				duration: Date.now() - job.createdAt.getTime(),
			});

			this.updateProgress(jobId, 100);
		} catch (error) {
			job.status = "error";
			job.error =
				error instanceof Error ? error.message : "Unknown conversion error";
			console.error(`Conversion failed for job ${jobId}:`, error);
		}
	}

	/**
	 * Routes conversion based on input and output formats
	 */
	private async convertFile(
		file: File,
		inputFormat: SupportedFormat,
		outputFormat: SupportedFormat,
		jobId: string
	): Promise<Blob> {
		const conversionKey = `${inputFormat}-to-${outputFormat}`;
		console.log(`Converting ${conversionKey} for job ${jobId}`);

		this.updateProgress(jobId, 50);

		try {
			switch (conversionKey) {
				// Simple text-based conversions (most reliable)
				case "txt-to-html":
					console.log(`Processing text-to-html conversion`);
					const textContent = await file.text();
					const htmlFromText = textToHTML(textContent, file.name);
					console.log(
						`Text-to-HTML conversion successful, HTML length: ${htmlFromText.length}`
					);
					return new Blob([htmlFromText], { type: "text/html" });

				case "html-to-txt":
					console.log(`Processing html-to-text conversion`);
					const htmlText = await file.text();
					// Strip HTML tags for plain text
					const plainText = htmlText
						.replace(/<[^>]*>/g, "")
						.replace(/\s+/g, " ")
						.trim();
					console.log(
						`HTML-to-text conversion successful, text length: ${plainText.length}`
					);
					return new Blob([plainText], { type: "text/plain" });

				// DOCX conversions using mammoth.js (most reliable)
				case "docx-to-html":
					console.log(`Processing docx-to-html conversion using mammoth.js`);
					const htmlFromDocx = await docxToHTML(file);
					console.log(
						`DOCX-to-HTML conversion successful, HTML length: ${htmlFromDocx.length}`
					);
					return new Blob([htmlFromDocx], { type: "text/html" });

				case "docx-to-txt":
					console.log(`Processing docx-to-text conversion using mammoth.js`);
					const textFromDocx = await docxToText(file);
					console.log(
						`DOCX-to-text conversion successful, text length: ${textFromDocx.length}`
					);
					return new Blob([textFromDocx], { type: "text/plain" });

				// Other conversions with improved error handling
				case "txt-to-pdf":
					console.log(`Processing text-to-pdf conversion using pdf-lib`);
					const textForPdf = await file.text();
					const pdfBlob = await textToPDF(textForPdf);
					console.log(
						`Text-to-PDF conversion successful, PDF size: ${pdfBlob.size}`
					);
					return pdfBlob;

				case "txt-to-docx":
					console.log(`Processing text-to-docx conversion`);
					const textForDocx = await file.text();
					const docxBlob = await textToDocx(textForDocx);
					console.log(
						`Text-to-DOCX conversion successful, DOCX size: ${docxBlob.size}`
					);
					return docxBlob;

				case "html-to-pdf":
					console.log(`Processing html-to-pdf conversion using html2pdf.js`);
					const pdfFromHtml = await htmlFileToPDF(file);
					console.log(
						`HTML-to-PDF conversion successful, PDF size: ${pdfFromHtml.size}`
					);
					return pdfFromHtml;

				case "html-to-docx":
					console.log(`Processing html-to-docx conversion`);
					const htmlContent = await file.text();
					const docxFromHtml = await htmlToDocx(htmlContent);
					console.log(
						`HTML-to-DOCX conversion successful, DOCX size: ${docxFromHtml.size}`
					);
					return docxFromHtml;

				case "docx-to-pdf":
					console.log(`Processing docx-to-pdf conversion (docx->html->pdf)`);
					const htmlForPdf = await docxToHTML(file);
					const pdfFromDocx = await htmlToPDF(
						htmlForPdf,
						file.name.replace(".docx", ".pdf")
					);
					console.log(
						`DOCX-to-PDF conversion successful, PDF size: ${pdfFromDocx.size}`
					);
					return pdfFromDocx;

				// PDF conversions (limited in browser)
				case "pdf-to-txt":
					console.log(`Processing pdf-to-text conversion (limited)`);
					const pdfText = await extractTextFromPDF(file);
					console.log(
						`PDF-to-text conversion result, text length: ${pdfText.length}`
					);
					return new Blob([pdfText], { type: "text/plain" });

				case "pdf-to-docx":
					console.log(`Processing pdf-to-docx conversion (limited)`);
					const pdfTextForDocx = await extractTextFromPDF(file);
					const docxFromPdf = await textToDocx(pdfTextForDocx);
					console.log(
						`PDF-to-DOCX conversion successful, DOCX size: ${docxFromPdf.size}`
					);
					return docxFromPdf;

				case "pdf-to-html":
					console.log(`Processing pdf-to-html conversion (limited)`);
					const pdfTextForHtml = await extractTextFromPDF(file);
					const htmlFromPdf = textToHTML(pdfTextForHtml, file.name);
					console.log(
						`PDF-to-HTML conversion successful, HTML length: ${htmlFromPdf.length}`
					);
					return new Blob([htmlFromPdf], { type: "text/html" });

				default:
					throw new Error(
						`Conversion from ${inputFormat} to ${outputFormat} is not supported`
					);
			}
		} catch (error) {
			console.error(`Conversion failed for ${conversionKey}:`, error);
			throw error;
		}
	}

	/**
	 * Gets supported conversion tools
	 */
	getSupportedTools() {
		return [
			// Most reliable conversions first
			{
				id: "txt-to-html",
				name: "Text to HTML",
				description: "Convert plain text to HTML format",
				inputFormat: "txt" as SupportedFormat,
				outputFormat: "html" as SupportedFormat,
				icon: "📝→🌐",
				isAvailable: true,
				maxFileSize: 10 * 1024 * 1024,
			},
			{
				id: "html-to-txt",
				name: "HTML to Text",
				description: "Extract plain text from HTML documents",
				inputFormat: "html" as SupportedFormat,
				outputFormat: "txt" as SupportedFormat,
				icon: "🌐→📝",
				isAvailable: true,
				maxFileSize: 10 * 1024 * 1024,
			},
			{
				id: "docx-to-html",
				name: "Word to HTML",
				description: "Convert Word documents to HTML format",
				inputFormat: "docx" as SupportedFormat,
				outputFormat: "html" as SupportedFormat,
				icon: "📄→🌐",
				isAvailable: true,
				maxFileSize: 10 * 1024 * 1024,
			},
			{
				id: "docx-to-txt",
				name: "Word to Text",
				description: "Extract plain text from Word documents",
				inputFormat: "docx" as SupportedFormat,
				outputFormat: "txt" as SupportedFormat,
				icon: "📄→📝",
				isAvailable: true,
				maxFileSize: 10 * 1024 * 1024,
			},
			// Experimental conversions
			{
				id: "txt-to-pdf",
				name: "Text to PDF",
				description: "Convert plain text to PDF format (experimental)",
				inputFormat: "txt" as SupportedFormat,
				outputFormat: "pdf" as SupportedFormat,
				icon: "📝→📄",
				isAvailable: true,
				maxFileSize: 5 * 1024 * 1024,
			},
			{
				id: "html-to-pdf",
				name: "HTML to PDF",
				description: "Convert HTML pages to PDF documents (experimental)",
				inputFormat: "html" as SupportedFormat,
				outputFormat: "pdf" as SupportedFormat,
				icon: "🌐→📄",
				isAvailable: true,
				maxFileSize: 5 * 1024 * 1024,
			},
		];
	}
}
