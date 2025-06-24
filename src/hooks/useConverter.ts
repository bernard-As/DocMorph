/**
 * Custom hook for document conversion
 * Built by Montfort Assogba for DocMorph
 */

import { useState, useCallback, useRef } from "react";
import { ConversionJob, SupportedFormat } from "../types";
import { ConversionEngine } from "../utils/conversionEngine";
import { storageService } from "../utils/storage";

export function useConverter() {
	const [jobs, setJobs] = useState<ConversionJob[]>([]);
	const [isProcessing, setIsProcessing] = useState(false);
	const engineRef = useRef<ConversionEngine | null>(null);

	// Initialize conversion engine
	const getEngine = useCallback(() => {
		if (!engineRef.current) {
			engineRef.current = new ConversionEngine();
		}
		return engineRef.current;
	}, []);

	/**
	 * Starts a new conversion
	 */
	const startConversion = useCallback(
		async (file: File, outputFormat: SupportedFormat): Promise<string> => {
			const engine = getEngine();
			setIsProcessing(true);

			try {
				// Start the conversion without progress callback to avoid closure issue
				const jobId = await engine.startConversion(file, outputFormat);

				// Add job to state
				const job = engine.getJob(jobId);
				if (job) {
					setJobs((currentJobs) => [...currentJobs, job]);

					// Poll for completion
					const pollInterval = setInterval(() => {
						const updatedJob = engine.getJob(jobId);
						if (updatedJob) {
							setJobs((currentJobs) =>
								currentJobs.map((j) => (j.id === jobId ? updatedJob : j))
							);

							if (updatedJob.status === "completed") {
								clearInterval(pollInterval);
								setIsProcessing(false);
								// Save to history
								storageService.saveConversionToHistory(updatedJob);
							} else if (updatedJob.status === "error") {
								clearInterval(pollInterval);
								setIsProcessing(false);
							}
						}
					}, 500);
				}

				return jobId;
			} catch (error) {
				setIsProcessing(false);
				throw error;
			}
		},
		[getEngine]
	);

	/**
	 * Downloads the converted file
	 */
	const downloadResult = useCallback(
		(jobId: string) => {
			const job = jobs.find((j) => j.id === jobId);
			if (job?.outputBlob && job.outputFileName) {
				const url = URL.createObjectURL(job.outputBlob);
				const a = document.createElement("a");
				a.href = url;
				a.download = job.outputFileName;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			}
		},
		[jobs]
	);

	/**
	 * Cancels a conversion job
	 */
	const cancelJob = useCallback(
		(jobId: string) => {
			const engine = getEngine();
			const cancelled = engine.cancelJob(jobId);

			if (cancelled) {
				setJobs((currentJobs) =>
					currentJobs.map((job) =>
						job.id === jobId
							? { ...job, status: "error" as const, error: "Cancelled by user" }
							: job
					)
				);
			}

			setIsProcessing(false);
			return cancelled;
		},
		[getEngine]
	);

	/**
	 * Clears completed/error jobs
	 */
	const clearJobs = useCallback(() => {
		setJobs((currentJobs) =>
			currentJobs.filter((job) => job.status === "processing")
		);
	}, []);

	/**
	 * Gets supported conversion tools
	 */
	const getSupportedTools = useCallback(() => {
		const engine = getEngine();
		return engine.getSupportedTools();
	}, [getEngine]);

	return {
		jobs,
		isProcessing,
		startConversion,
		downloadResult,
		cancelJob,
		clearJobs,
		getSupportedTools,
	};
}
