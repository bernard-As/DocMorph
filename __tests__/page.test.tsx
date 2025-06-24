/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import Page from "../src/app/page";

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
	motion: {
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
		button: ({ children, ...props }: any) => (
			<button {...props}>{children}</button>
		),
	},
	AnimatePresence: ({ children }: any) => children,
}));

// Mock the hooks
jest.mock("../src/hooks/useTheme", () => ({
	useTheme: () => ({
		theme: "light",
		setTheme: jest.fn(),
		toggleTheme: jest.fn(),
	}),
}));

describe("DocMorph Homepage", () => {
	it("renders the main heading", () => {
		render(<Page />);

		const heading = screen.getByText("Professional");
		expect(heading).toBeInTheDocument();
	});

	it("renders the DocMorph title", () => {
		render(<Page />);

		const title = screen.getByText("DocMorph");
		expect(title).toBeInTheDocument();
	});

	it("renders the author credit", () => {
		render(<Page />);

		const author = screen.getByText("by Montfort Assogba");
		expect(author).toBeInTheDocument();
	});

	it("renders the converter and history tabs", () => {
		render(<Page />);

		const converterTab = screen.getByText("Converter");
		const historyTab = screen.getByText("History");

		expect(converterTab).toBeInTheDocument();
		expect(historyTab).toBeInTheDocument();
	});

	it("renders the features section", () => {
		render(<Page />);

		expect(screen.getByText("Privacy First")).toBeInTheDocument();
		expect(screen.getByText("Lightning Fast")).toBeInTheDocument();
		expect(screen.getByText("Modern Interface")).toBeInTheDocument();
	});
});
