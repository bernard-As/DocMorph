/**
 * DOCX Conversion Utilities using mammoth.js
 * Built by Montfort Assogba for DocMorph
 */

import mammoth from "mammoth";
import { readFileAsArrayBuffer } from "./fileUtils";

/**
 * Converts DOCX to HTML using mammoth.js
 */
export async function docxToHTML(file: File): Promise<string> {
	try {
		const arrayBuffer = await readFileAsArrayBuffer(file);
		const result = await mammoth.convertToHtml({ arrayBuffer });

		if (result.messages.length > 0) {
			console.warn("DOCX conversion warnings:", result.messages);
		}

		return result.value;
	} catch (error) {
		throw new Error(
			`Failed to convert DOCX to HTML: ${
				error instanceof Error ? error.message : "Unknown error"
			}`
		);
	}
}

/**
 * Converts DOCX to plain text using mammoth.js
 */
export async function docxToText(file: File): Promise<string> {
	try {
		const arrayBuffer = await readFileAsArrayBuffer(file);
		const result = await mammoth.extractRawText({ arrayBuffer });

		if (result.messages.length > 0) {
			console.warn("DOCX text extraction warnings:", result.messages);
		}

		return result.value;
	} catch (error) {
		throw new Error(
			`Failed to extract text from DOCX: ${
				error instanceof Error ? error.message : "Unknown error"
			}`
		);
	}
}

/**
 * Converts HTML to DOCX using a browser-compatible approach
 * Note: This is a simplified conversion - for full HTML->DOCX conversion,
 * consider using server-side conversion or a different library
 */
export async function htmlToDocx(html: string): Promise<Blob> {
	try {
		// Since html-docx-js doesn't work in browsers, we'll create a simple RTF file
		// that can be opened by Word processors as a fallback

		// Clean up HTML for better conversion
		const cleanHtml = html
			.replace(/<style[^>]*>.*?<\/style>/gi, "") // Remove style tags
			.replace(/<script[^>]*>.*?<\/script>/gi, "") // Remove script tags
			.replace(/class="[^"]*"/gi, "") // Remove class attributes
			.replace(/id="[^"]*"/gi, ""); // Remove id attributes

		// Convert HTML to plain text (basic conversion)
		const textContent = cleanHtml
			.replace(/<br\s*\/?>/gi, "\n")
			.replace(/<\/p>/gi, "\n\n")
			.replace(/<[^>]*>/g, "")
			.replace(/&nbsp;/g, " ")
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, '"')
			.trim();

		// Create a simple RTF document that Word can open
		const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 ${textContent.replace(/\n/g, "\\par ")}}`;

		// Return as a blob with .docx extension (though it's RTF, most Word processors will handle it)
		return new Blob([rtfContent], {
			type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		});
	} catch (error) {
		throw new Error(
			`Failed to convert HTML to DOCX: ${
				error instanceof Error ? error.message : "Unknown error"
			}`
		);
	}
}

/**
 * Creates a simple DOCX from plain text
 */
export async function textToDocx(text: string): Promise<Blob> {
	try {
		// Convert text to simple HTML first
		const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Converted Document</title>
      </head>
      <body>
        <div style="font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.5;">
          ${text
						.split("\n")
						.map((line) => `<p>${line || "&nbsp;"}</p>`)
						.join("")}
        </div>
      </body>
      </html>
    `;

		return await htmlToDocx(html);
	} catch (error) {
		throw new Error(
			`Failed to convert text to DOCX: ${
				error instanceof Error ? error.message : "Unknown error"
			}`
		);
	}
}
