import { describe, it, expect } from "@jest/globals";
import {
	validateFile,
	detectFileFormat,
	generateJobId,
} from "../src/utils/fileUtils";

describe("File Utils", () => {
	describe("validateFile", () => {
		it("should validate file size correctly", () => {
			const smallFile = new File(["test"], "test.txt", { type: "text/plain" });
			expect(() => validateFile(smallFile)).not.toThrow();
		});

		it("should throw error for files that are too large", () => {
			// Create a mock file that's larger than the limit
			const largeFile = {
				size: 11 * 1024 * 1024, // 11MB
				name: "large.txt",
			} as File;

			expect(() => validateFile(largeFile)).toThrow("File too large");
		});
	});

	describe("detectFileFormat", () => {
		it("should detect PDF format correctly", () => {
			const pdfFile = new File([""], "document.pdf", {
				type: "application/pdf",
			});
			expect(detectFileFormat(pdfFile)).toBe("pdf");
		});

		it("should detect DOCX format correctly", () => {
			const docxFile = new File([""], "document.docx", {
				type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			});
			expect(detectFileFormat(docxFile)).toBe("docx");
		});

		it("should detect HTML format correctly", () => {
			const htmlFile = new File([""], "document.html", { type: "text/html" });
			expect(detectFileFormat(htmlFile)).toBe("html");
		});

		it("should detect TXT format correctly", () => {
			const txtFile = new File([""], "document.txt", { type: "text/plain" });
			expect(detectFileFormat(txtFile)).toBe("txt");
		});

		it("should throw error for unsupported formats", () => {
			const unsupportedFile = new File([""], "document.xyz", {
				type: "application/octet-stream",
			});
			expect(() => detectFileFormat(unsupportedFile)).toThrow(
				"Unsupported file format"
			);
		});
	});

	describe("generateJobId", () => {
		it("should generate unique job IDs", () => {
			const id1 = generateJobId();
			const id2 = generateJobId();

			expect(id1).not.toBe(id2);
			expect(id1).toMatch(/^job_\d+_\w+$/);
			expect(id2).toMatch(/^job_\d+_\w+$/);
		});
	});
});
