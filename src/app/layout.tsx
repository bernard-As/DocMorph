import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: "Montfort Assogba | DocMorph - Browser-Based Document Converter",
	description:
		"Convert PDFs, DOCX, and HTML documents in-browser. No upload. Fast. Secure. Built by Montfort Assogba - Modern Web Developer passionate about AI, code, and design.",
	keywords: [
		"Montfort Assogba",
		"PDF to Word",
		"Word to PDF",
		"document converter online",
		"Next.js converter SPA",
		"client-side document conversion",
		"browser-based converter",
		"privacy-first document tools",
	],
	authors: [{ name: "Montfort Assogba" }],
	creator: "Montfort Assogba",
	publisher: "Montfort Assogba",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://montfort-assogba.github.io"),
	alternates: {
		canonical: "/docmorph",
	},
	openGraph: {
		title: "DocMorph - Professional Document Converter by Montfort Assogba",
		description:
			"Convert PDFs, DOCX, and HTML documents entirely in your browser. No upload required. Fast, secure, and privacy-first.",
		url: "https://montfort-assogba.github.io/docmorph",
		siteName: "DocMorph by Montfort Assogba",
		images: [
			{
				url: "/docmorph/og-image.png",
				width: 1200,
				height: 630,
				alt: "DocMorph - Browser-Based Document Converter",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "DocMorph - Browser Document Converter",
		description:
			"Convert documents in-browser. No upload. Privacy-first. By Montfort Assogba",
		images: ["/docmorph/twitter-image.png"],
		creator: "@montfort_dev",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	manifest: "/docmorph/manifest.json",
	icons: {
		icon: "/docmorph/favicon.ico",
		shortcut: "/docmorph/favicon-16x16.png",
		apple: "/docmorph/apple-touch-icon.png",
	},
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#1da1f2" },
		{ media: "(prefers-color-scheme: dark)", color: "#14171a" },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
			</head>
			<body
				className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen transition-colors duration-300`}>
				{children}
			</body>
		</html>
	);
}
