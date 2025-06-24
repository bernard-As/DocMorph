/**
 * PDF Conversion Utilities using pdf-lib
 * Built by Montfort Assogba for DocMorph
 */

import { PDFDocument, rgb } from "pdf-lib";
import { readFileAsArrayBuffer } from "./fileUtils";

/**
 * Extracts text from PDF using pdf-lib
 */
export async function extractTextFromPDF(file: File): Promise<string> {
	try {
		const arrayBuffer = await readFileAsArrayBuffer(file);
		const pdfDoc = await PDFDocument.load(arrayBuffer);
		const pages = pdfDoc.getPages();

		let fullText = "";

		// Note: pdf-lib doesn't have built-in text extraction
		// This is a simplified approach - for production, consider pdf2pic + OCR
		for (let i = 0; i < pages.length; i++) {
			const page = pages[i];
			const { width, height } = page.getSize();

			// This is a placeholder - pdf-lib doesn't extract text directly
			// In a real implementation, you'd need additional libraries like pdf-parse
			fullText += `Page ${i + 1} content (${width}x${height})\n\n`;
		}

		return (
			fullText ||
			"Text extraction not fully implemented with pdf-lib alone. Consider using pdf-parse or similar libraries for complete text extraction."
		);
	} catch (error) {
		throw new Error(
			`Failed to extract text from PDF: ${
				error instanceof Error ? error.message : "Unknown error"
			}`
		);
	}
}

/**
 * Converts text to PDF
 */
export async function textToPDF(text: string): Promise<Blob> {
	try {
		const pdfDoc = await PDFDocument.create();
		const page = pdfDoc.addPage([612, 792]); // Letter size

		// Add text to the page
		const font = await pdfDoc.embedFont("Helvetica");
		const fontSize = 12;
		const margin = 50;
		const lineHeight = fontSize * 1.2;
		const maxWidth = page.getWidth() - 2 * margin;

		const lines = text.split("\n");
		let yPosition = page.getHeight() - margin;

		for (const line of lines) {
			if (yPosition < margin) {
				// Add new page if needed
				const newPage = pdfDoc.addPage([612, 792]);
				yPosition = newPage.getHeight() - margin;
			}

			page.drawText(line, {
				x: margin,
				y: yPosition,
				size: fontSize,
				font,
				color: rgb(0, 0, 0),
				maxWidth,
			});

			yPosition -= lineHeight;
		}

		const pdfBytes = await pdfDoc.save();
		return new Blob([pdfBytes], { type: "application/pdf" });
	} catch (error) {
		throw new Error(
			`Failed to create PDF: ${
				error instanceof Error ? error.message : "Unknown error"
			}`
		);
	}
}

/**
 * Merges multiple PDFs into one
 */
export async function mergePDFs(files: File[]): Promise<Blob> {
	try {
		const mergedPdf = await PDFDocument.create();

		for (const file of files) {
			const arrayBuffer = await readFileAsArrayBuffer(file);
			const pdf = await PDFDocument.load(arrayBuffer);
			const pageIndices = pdf.getPageIndices();

			const pages = await mergedPdf.copyPages(pdf, pageIndices);
			pages.forEach((page) => mergedPdf.addPage(page));
		}

		const pdfBytes = await mergedPdf.save();
		return new Blob([pdfBytes], { type: "application/pdf" });
	} catch (error) {
		throw new Error(
			`Failed to merge PDFs: ${
				error instanceof Error ? error.message : "Unknown error"
			}`
		);
	}
}

/**
 * Splits PDF into separate pages
 */
export async function splitPDF(file: File): Promise<Blob[]> {
	try {
		const arrayBuffer = await readFileAsArrayBuffer(file);
		const pdfDoc = await PDFDocument.load(arrayBuffer);
		const pageCount = pdfDoc.getPageCount();

		const splitPdfs: Blob[] = [];

		for (let i = 0; i < pageCount; i++) {
			const newPdf = await PDFDocument.create();
			const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
			newPdf.addPage(copiedPage);

			const pdfBytes = await newPdf.save();
			splitPdfs.push(new Blob([pdfBytes], { type: "application/pdf" }));
		}

		return splitPdfs;
	} catch (error) {
		throw new Error(
			`Failed to split PDF: ${
				error instanceof Error ? error.message : "Unknown error"
			}`
		);
	}
}
