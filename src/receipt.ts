export class ReceiptError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ReceiptError";
	}
}

export class InvalidReceiptFieldError extends ReceiptError {
	constructor(detail: string) {
		const message = `Invalid field type for receipt. ${detail}`;
		super(message);
		this.name = "InvalidReceiptFieldError";
	}
}

type Item = {
	shortDescription: string;
	price: number;
};

export class Receipt {
	readonly retailer: string;
	readonly date: Date;
	readonly items: Item[];
	readonly total: number;

	constructor(json: Record<string, unknown>) {
		this.retailer = this.buildRetailer(json);
		this.date = this.buildPurchaseDate(json);
		this.total = this.buildTotal(json);
		this.items = this.buildItems(json);
	}

	private buildRetailer(json: Record<string, unknown>): string {
		if (!json.retailer) {
			throw new InvalidReceiptFieldError('"retailer" field missing or empty.');
		}

		if (typeof json.retailer !== "string") {
			throw new InvalidReceiptFieldError(
				'Expected "retailer" field to be type of "string".',
			);
		}

		return json.retailer.trim();
	}

	private buildPurchaseDate(json: Record<string, unknown>): Date {
		if (!json.purchaseDate) {
			throw new InvalidReceiptFieldError('"date" field missing or empty.');
		}

		if (!json.purchaseTime) {
			throw new InvalidReceiptFieldError('"time" field missing or empty.');
		}

		if (
			typeof json.purchaseDate !== "string" ||
			typeof json.purchaseTime !== "string"
		) {
			throw new InvalidReceiptFieldError(
				'Expected "date" and "time" fields to be type of "string".',
			);
		}

		// Assuming dates are in UTC?
		const date = new Date(
			`${json.purchaseDate.trim()}T${json.purchaseTime.trim()}Z`,
		);

		if (date instanceof Date && !Number.isNaN(date.valueOf())) {
			return date;
		}

		throw new InvalidReceiptFieldError(
			`Could not parse ${json.purchaseDate} and ${json.purchaseTime} into a valid date.`,
		);
	}

	private buildTotal(json: Record<string, unknown>): number {
		if (!json.total) {
			throw new InvalidReceiptFieldError('"total" is missing or empty.');
		}

		if (typeof json.total !== "string") {
			throw new InvalidReceiptFieldError(
				'Expected "total" field to be type of "string".',
			);
		}

		const total = Number.parseFloat(json.total.trim());

		if (Number.isNaN(total)) {
			throw new InvalidReceiptFieldError(
				'Tried to parse "total" field, but it is NaN.',
			);
		}

		return total;
	}

	private buildItems(json: Record<string, unknown>): Item[] {
		if (!json.items) {
			throw new InvalidReceiptFieldError('"items" is missing or empty.');
		}

		if (!Array.isArray(json.items)) {
			throw new InvalidReceiptFieldError(
				'Expected "items" field to be an array.',
			);
		}

		if (!json.items.length) {
			throw new InvalidReceiptFieldError(
				'Expected "items" array to not be empty.',
			);
		}

		return json.items.map((item) => this.buildItem(item));
	}

	private buildItem(item: unknown): Item {
		if (!item) {
			throw new InvalidReceiptFieldError("Receipt item is missing or empty.");
		}

		if (!this.isObject(item)) {
			throw new InvalidReceiptFieldError(
				"Expected receipt item to be an json object.",
			);
		}

		if (!item.shortDescription) {
			throw new InvalidReceiptFieldError(
				'Receipt item field "shortDescription" missing or empty.',
			);
		}

		if (typeof item.shortDescription !== "string") {
			throw new InvalidReceiptFieldError(
				'Expected receipt item field "shortDescription" to be "string".',
			);
		}

		if (!item.price) {
			throw new InvalidReceiptFieldError(
				'Receipt item field "price" missing or empty.',
			);
		}

		if (typeof item.price !== "string") {
			throw new InvalidReceiptFieldError(
				'Expected receipt item field "price" to be "string".',
			);
		}

		const price = Number.parseFloat(item.price.trim());

		if (Number.isNaN(price)) {
			throw new InvalidReceiptFieldError(
				'Tried to parse "price" field, but it is NaN.',
			);
		}

		return {
			shortDescription: item.shortDescription.trim(),
			price,
		};
	}

	private isObject(value: unknown): value is Record<string, unknown> {
		return (
			(typeof value === "object" && !Array.isArray(value)) || value !== null
		);
	}
}
