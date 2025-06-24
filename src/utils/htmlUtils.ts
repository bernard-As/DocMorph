/**
 import { SupportedFormat } from '../types';

// Define the options interface locally
interface HTML2PDFOptions {
  margin: number | [number, number, number, number];
  filename: string;
  image: {
    type: 'jpeg' | 'png';
    quality: number;
  };
  html2canvas: {
    scale: number;
    letterRendering: boolean;
  };
  jsPDF: {
    unit: 'mm' | 'cm' | 'in' | 'px';
    format: 'a4' | 'letter' | [number, number];
    orientation: 'portrait' | 'landscape';
  };
/**
 * HTML and PDF Conversion Utilities
 * Built by Montfort Assogba for DocMorph
 */

import { readFileAsText } from './fileUtils';

// Define the options interface locally
interface HTML2PDFOptions {
  margin: number | [number, number, number, number];
  filename: string;
  image: {
    type: 'jpeg' | 'png';
    quality: number;
  };
  html2canvas: {
    scale: number;
    letterRendering: boolean;
  };
  jsPDF: {
    unit: 'mm' | 'cm' | 'in' | 'px';
    format: 'a4' | 'letter' | [number, number];
    orientation: 'portrait' | 'landscape';
  };
}

/**
 * Converts HTML to PDF using html2pdf.js
 */
export async function htmlToPDF(html: string, filename: string): Promise<Blob> {
	try {
		// Dynamic import to handle client-side library
		const html2pdf = (await import("html2pdf.js")).default;

		const options: HTML2PDFOptions = {
			margin: 1,
			filename,
			image: { type: "jpeg", quality: 0.98 },
			html2canvas: { scale: 2, letterRendering: true },
			jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
		};

		// Create a temporary container
		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = html;
		tempDiv.style.position = "absolute";
		tempDiv.style.left = "-9999px";
		document.body.appendChild(tempDiv);

		try {
			const pdf = await html2pdf().set(options).from(tempDiv).output("blob");
			return pdf;
		} finally {
			document.body.removeChild(tempDiv);
		}
	} catch (error) {
		throw new Error(
			`Failed to convert HTML to PDF: ${
				error instanceof Error ? error.message : "Unknown error"
			}`
		);
	}
}

/**
 * Converts HTML file to PDF
 */
export async function htmlFileToPDF(file: File): Promise<Blob> {
	try {
		const html = await readFileAsText(file);
		const filename = file.name.replace(/\.html?$/i, ".pdf");
		return await htmlToPDF(html, filename);
	} catch (error) {
		throw new Error(
			`Failed to convert HTML file to PDF: ${
				error instanceof Error ? error.message : "Unknown error"
			}`
		);
	}
}

/**
 * Cleans HTML content for better conversion
 */
export function cleanHTMLForConversion(html: string): string {
	return (
		html
			// Remove script tags
			.replace(/<script[^>]*>.*?<\/script>/gi, "")
			// Remove style tags (optional - you might want to keep some styles)
			.replace(/<style[^>]*>.*?<\/style>/gi, "")
			// Remove comments
			.replace(/<!--.*?-->/gi, "")
			// Clean up excessive whitespace
			.replace(/\s+/g, " ")
			// Ensure proper HTML structure
			.trim()
	);
}

/**
 * Creates a printable HTML document
 */
export function createPrintableHTML(
	content: string,
	title: string = "Document"
): string {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 40px;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        p {
            margin-bottom: 15px;
        }
        @media print {
            body {
                margin: 20px;
            }
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>
  `.trim();
}

/**
 * Converts text to HTML
 */
export function textToHTML(text: string, title: string = "Document"): string {
	const htmlContent = text
		.split("\n")
		.map((line) => (line.trim() === "" ? "<br>" : `<p>${line}</p>`))
		.join("\n");

	return createPrintableHTML(htmlContent, title);
}
