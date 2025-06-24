/**
 * Custom hook for conversion history management
 * Built by Montfort Assogba for DocMorph
 */

import { useState, useEffect, useCallback } from "react";
import { ConversionHistory } from "../types";
import { storageService } from "../utils/storage";

export function useConversionHistory() {
	const [history, setHistory] = useState<ConversionHistory[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const loadHistory = useCallback(async () => {
		try {
			setIsLoading(true);
			const historyData = await storageService.getConversionHistory();
			setHistory(historyData);
		} catch (error) {
			console.error("Failed to load conversion history:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Load history on mount
	useEffect(() => {
		loadHistory();
	}, [loadHistory]);

	const removeFromHistory = useCallback(async (itemId: string) => {
		try {
			await storageService.removeFromHistory(itemId);
			setHistory((currentHistory) =>
				currentHistory.filter((item) => item.id !== itemId)
			);
		} catch (error) {
			console.error("Failed to remove item from history:", error);
		}
	}, []);

	const clearHistory = useCallback(async () => {
		try {
			await storageService.clearConversionHistory();
			setHistory([]);
		} catch (error) {
			console.error("Failed to clear history:", error);
		}
	}, []);

	const refreshHistory = useCallback(() => {
		loadHistory();
	}, [loadHistory]);

	return {
		history,
		isLoading,
		removeFromHistory,
		clearHistory,
		refreshHistory,
	};
}
