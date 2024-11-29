import type { Receipt } from "./receipt";

/**
 * Scoring
 *
 * One point for every alphanumeric character in the retailer name.
 * 50 points if the total is a round dollar amount with no cents.
 * 25 points if the total is a multiple of 0.25.
 * 5 points for every two items on the receipt.
 * If the trimmed length of the item description is a multiple of 3,
 *   multiply the price by 0.2 and round up to the nearest integer.
 *   The result is the number of points earned.
 * 6 points if the day in the purchase date is odd.
 * 10 points if the time of purchase is after 2:00pm and before 4:00pm.
 */

export class PointsCalculator {
	constructor(private receipt: Receipt) {}

	calculateTotal(): number {
		let total = 0;

		total += this.pointRetailer();
		total += this.pointTotal();
		total += this.pointItems();
		total += this.pointItemDescriptions();
		total += this.pointDate();
		total += this.pointTime();

		return total;
	}

	pointRetailer(): number {
		// One point per-alphanumeric character. Assuming underscores will be
		// calculated.
		return this.receipt.retailer.replaceAll(/[\W\s]/g, "").length;
	}

	pointTotal(): number {
		if (Number.isInteger(this.receipt.total)) {
			// If the number is an integer, it is both round and multiple of .25.
			return 75;
		}

		if (this.receipt.total % 0.25 === 0) {
			return 25;
		}

		return 0;
	}

	pointItems(): number {
		if (!this.receipt.items.length) {
			return 0;
		}

		return Math.floor(this.receipt.items.length / 2) * 5;
	}

	pointItemDescriptions(): number {
		let points = 0;
		if (!this.receipt.items.length) {
			return points;
		}

		const multiplier = 0.2;

		// Making an assumption that matching item descriptions
		// are additive.
		for (const item of this.receipt.items) {
			if (item.shortDescription.length % 3 === 0) {
				const priceBonus = Math.ceil(item.price * multiplier);
				points += priceBonus;
			}
		}

		return points;
	}

	pointDate(): number {
		if (this.receipt.date.getUTCDate() % 2 !== 0) {
			return 6;
		}

		return 0;
	}

	pointTime(): number {
		const purchaseHour = this.receipt.date.getUTCHours();
		const twoPM = 14;
		const fourPM = 16;

		if (purchaseHour >= twoPM && purchaseHour < fourPM) {
			return 10;
		}

		return 0;
	}
}
