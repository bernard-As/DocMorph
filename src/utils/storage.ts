/**
 * Local Storage Utilities for DocMorph
 * Built by Montfort Assogba
 */

import localForage from "localforage";
import { ConversionHistory, ConversionJob } from "../types";

// Configure localForage
localForage.config({
	name: "DocMorph",
	storeName: "conversions",
	description: "Document conversion history and cache",
});

const HISTORY_KEY = "conversion_history";
const MAX_HISTORY_ITEMS = 50;

/**
 * Storage service for conversion history
 */
export class StorageService {
	/**
	 * Saves a conversion to history
	 */
	async saveConversionToHistory(job: ConversionJob): Promise<void> {
		if (job.status !== "completed" || !job.outputFileName) {
			return;
		}

		try {
			const historyItem: ConversionHistory = {
				id: job.id,
				fileName: job.inputFile.name,
				inputFormat: job.inputFormat,
				outputFormat: job.outputFormat,
				fileSize: job.inputFile.size,
				convertedAt: job.completedAt || new Date(),
			};

			const history = await this.getConversionHistory();
			history.unshift(historyItem);

			// Keep only the most recent items
			const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

			await localForage.setItem(HISTORY_KEY, trimmedHistory);
		} catch (error) {
			console.error("Failed to save conversion to history:", error);
		}
	}

	/**
	 * Gets conversion history
	 */
	async getConversionHistory(): Promise<ConversionHistory[]> {
		try {
			const history =
				await localForage.getItem<ConversionHistory[]>(HISTORY_KEY);
			return history || [];
		} catch (error) {
			console.error("Failed to load conversion history:", error);
			return [];
		}
	}

	/**
	 * Clears conversion history
	 */
	async clearConversionHistory(): Promise<void> {
		try {
			await localForage.removeItem(HISTORY_KEY);
		} catch (error) {
			console.error("Failed to clear conversion history:", error);
		}
	}

	/**
	 * Removes a specific item from history
	 */
	async removeFromHistory(itemId: string): Promise<void> {
		try {
			const history = await this.getConversionHistory();
			const filteredHistory = history.filter((item) => item.id !== itemId);
			await localForage.setItem(HISTORY_KEY, filteredHistory);
		} catch (error) {
			console.error("Failed to remove item from history:", error);
		}
	}

	/**
	 * Gets storage usage information
	 */
	async getStorageInfo(): Promise<{ used: number; available: number }> {
		try {
			// This is an approximation since we can't get exact quota in all browsers
			const history = await this.getConversionHistory();
			const used = JSON.stringify(history).length;

			// Estimate available space (browsers typically allow 5-10MB for IndexedDB)
			const available = 5 * 1024 * 1024; // 5MB estimate

			return { used, available };
		} catch (error) {
			console.error("Failed to get storage info:", error);
			return { used: 0, available: 0 };
		}
	}

	/**
	 * Saves user preferences
	 */ async savePreferences(
		preferences: Record<string, unknown>
	): Promise<void> {
		try {
			await localForage.setItem("user_preferences", preferences);
		} catch (error) {
			console.error("Failed to save preferences:", error);
		}
	}

	/**
	 * Gets user preferences
	 */
	async getPreferences(): Promise<Record<string, unknown>> {
		try {
			const preferences =
				await localForage.getItem<Record<string, unknown>>("user_preferences");
			return preferences || {};
		} catch (error) {
			console.error("Failed to load preferences:", error);
			return {};
		}
	}
}

// Export singleton instance
export const storageService = new StorageService();
