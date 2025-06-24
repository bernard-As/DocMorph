/**
 * Footer Component
 * Built by Montfort Assogba for DocMorph
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
	HeartIcon,
	CodeBracketIcon,
	SparklesIcon,
} from "@heroicons/react/24/solid";

const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();

	return (
		<motion.footer
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="mt-16 py-8 border-t border-gray-200/50 dark:border-gray-700/50">
			<div className="max-w-6xl mx-auto px-4 text-center">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="flex flex-col items-center space-y-4">
					{/* Main Attribution */}
					<div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
						<span>Built with</span>
						<motion.div
							animate={{
								scale: [1, 1.2, 1],
								rotate: [0, 10, -10, 0],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								repeatDelay: 3,
							}}>
							<HeartIcon className="h-5 w-5 text-red-500" />
						</motion.div>
						<span>by</span>
						<motion.span
							className="font-semibold text-twitter-blue hover:text-twitter-darkBlue transition-colors cursor-default"
							whileHover={{ scale: 1.05 }}>
							Montfort Assogba
						</motion.span>
					</div>

					{/* Description */}
					<p className="text-gray-500 dark:text-gray-400 max-w-md">
						Modern Web Developer passionate about AI, code, and design. Creating
						beautiful, functional applications that solve real problems.
					</p>

					{/* Tech Stack */}
					<div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
						<div className="flex items-center space-x-1">
							<CodeBracketIcon className="h-4 w-4" />
							<span>Next.js</span>
						</div>
						<span>•</span>
						<div className="flex items-center space-x-1">
							<SparklesIcon className="h-4 w-4" />
							<span>TypeScript</span>
						</div>
						<span>•</span>
						<span>Tailwind CSS</span>
						<span>•</span>
						<span>Framer Motion</span>
					</div>

					{/* Features */}
					<div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 dark:text-gray-500">
						<span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
							🔒 Privacy-First
						</span>
						<span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
							⚡ Client-Side Only
						</span>
						<span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
							🌐 No Upload Required
						</span>
						<span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
							📱 Mobile Friendly
						</span>
					</div>

					{/* Copyright */}
					<div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50 w-full max-w-md">
						<p className="text-xs text-gray-400 dark:text-gray-500">
							© {currentYear} Montfort Assogba. All rights reserved.
						</p>
						<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
							DocMorph - Professional Document Conversion
						</p>
					</div>

					{/* Version */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
						className="text-xs text-gray-300 dark:text-gray-600">
						v1.0.0
					</motion.div>
				</motion.div>
			</div>
		</motion.footer>
	);
};

export default Footer;
