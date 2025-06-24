/**
 * Simple test file to debug conversion issues
 */

// Test the text to PDF conversion
export async function testTextToPDF() {
	try {
		const { textToPDF } = await import("./pdfUtils");
		const blob = await textToPDF("This is a test document");
		console.log("Text to PDF conversion successful:", blob);
		return blob;
	} catch (error) {
		console.error("Text to PDF conversion failed:", error);
		throw error;
	}
}

// Test the HTML to PDF conversion
export async function testHTMLToPDF() {
	try {
		const { htmlToPDF } = await import("./htmlUtils");
		const html = "<h1>Test Document</h1><p>This is a test.</p>";
		const blob = await htmlToPDF(html, "test.pdf");
		console.log("HTML to PDF conversion successful:", blob);
		return blob;
	} catch (error) {
		console.error("HTML to PDF conversion failed:", error);
		throw error;
	}
}

// Test mammoth.js DOCX conversion
export async function testDOCXToHTML() {
	try {
		const mammoth = await import("mammoth");
		console.log("Mammoth.js loaded successfully:", mammoth);

		// Create a simple test blob to simulate DOCX
		const testArrayBuffer = new ArrayBuffer(8);
		const result = await mammoth.convertToHtml({
			arrayBuffer: testArrayBuffer,
		});
		console.log("Mammoth conversion result:", result);
		return result;
	} catch (error) {
		console.error("DOCX to HTML conversion failed:", error);
		throw error;
	}
}
