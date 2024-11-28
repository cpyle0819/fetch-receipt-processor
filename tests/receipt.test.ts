import { describe, test, expect } from "bun:test";
import { InvalidReceiptFieldError, Receipt } from "../src/receipt";

describe("Receipt", () => {
	const validReceipt = {
		retailer: "Target",
		purchaseDate: "2022-01-01",
		purchaseTime: "13:01",
		items: [
			{
				shortDescription: "Mountain Dew 12PK",
				price: "6.49",
			},
			{
				shortDescription: "Emils Cheese Pizza",
				price: "12.25",
			},
			{
				shortDescription: "Knorr Creamy Chicken",
				price: "1.26",
			},
			{
				shortDescription: "Doritos Nacho Cheese",
				price: "3.35",
			},
			{
				shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
				price: "12.00",
			},
		],
		total: "35.35",
	};

	test("valid receipt should parse successfully", () => {
		const receipt = new Receipt(validReceipt);
		expect(receipt.date.toISOString()).toBe("2022-01-01T13:01:00.000Z");
		expect(receipt.retailer).toBe("Target");
		expect(receipt.total).toBe(35.35);
		expect(receipt.items).toEqual([
			{
				shortDescription: "Mountain Dew 12PK",
				price: 6.49,
			},
			{
				shortDescription: "Emils Cheese Pizza",
				price: 12.25,
			},
			{
				shortDescription: "Knorr Creamy Chicken",
				price: 1.26,
			},
			{
				shortDescription: "Doritos Nacho Cheese",
				price: 3.35,
			},
			{
				shortDescription: "Klarbrunn 12-PK 12 FL OZ",
				price: 12.0,
			},
		]);
	});

	test("invalid date should throw an error", () => {
		const invalidDateReceipt = {
			retailer: "Target",
			purchaseDate: "2022-01-011",
			purchaseTime: "13:01",
			items: [
				{
					shortDescription: "Mountain Dew 12PK",
					price: "6.49",
				},
				{
					shortDescription: "Emils Cheese Pizza",
					price: "12.25",
				},
				{
					shortDescription: "Knorr Creamy Chicken",
					price: "1.26",
				},
				{
					shortDescription: "Doritos Nacho Cheese",
					price: "3.35",
				},
				{
					shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
					price: "12.00",
				},
			],
			total: "35.35",
		};

		expect(() => new Receipt(invalidDateReceipt)).toThrowError(
			new InvalidReceiptFieldError(
				"Could not parse 2022-01-011 and 13:01 into a valid date.",
			),
		);
	});

	test("invalid time should throw an error", () => {
		const invalidTimeReceipt = {
			retailer: "Target",
			purchaseDate: "2022-01-01",
			purchaseTime: "25:01",
			items: [
				{
					shortDescription: "Mountain Dew 12PK",
					price: "6.49",
				},
				{
					shortDescription: "Emils Cheese Pizza",
					price: "12.25",
				},
				{
					shortDescription: "Knorr Creamy Chicken",
					price: "1.26",
				},
				{
					shortDescription: "Doritos Nacho Cheese",
					price: "3.35",
				},
				{
					shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
					price: "12.00",
				},
			],
			total: "35.35",
		};

		expect(() => new Receipt(invalidTimeReceipt)).toThrowError(
			new InvalidReceiptFieldError(
				"Could not parse 2022-01-01 and 25:01 into a valid date.",
			),
		);
	});

	test("empty retailer should throw an error", () => {
		const emptyRetailerReceipt = {
			retailer: "",
			purchaseDate: "2022-01-01",
			purchaseTime: "13:01",
			items: [
				{
					shortDescription: "Mountain Dew 12PK",
					price: "6.49",
				},
				{
					shortDescription: "Emils Cheese Pizza",
					price: "12.25",
				},
				{
					shortDescription: "Knorr Creamy Chicken",
					price: "1.26",
				},
				{
					shortDescription: "Doritos Nacho Cheese",
					price: "3.35",
				},
				{
					shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
					price: "12.00",
				},
			],
			total: "35.35",
		};

		expect(() => new Receipt(emptyRetailerReceipt)).toThrowError(
			new InvalidReceiptFieldError('"retailer" field missing or empty.'),
		);
	});

	test("invalid price should throw an error", () => {
		const invalidPriceReceipt = {
			retailer: "Target",
			purchaseDate: "2022-01-01",
			purchaseTime: "13:01",
			items: [
				{
					shortDescription: "Mountain Dew 12PK",
					price: "6.49",
				},
				{
					shortDescription: "Emils Cheese Pizza",
					price: "12.25",
				},
				{
					shortDescription: "Knorr Creamy Chicken",
					price: "1.26",
				},
				{
					shortDescription: "Doritos Nacho Cheese",
					price: "3.35",
				},
				{
					shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
					price: "12.00",
				},
			],
			total: "not a number",
		};

		expect(() => new Receipt(invalidPriceReceipt)).toThrowError(
			new InvalidReceiptFieldError(
				'Tried to parse "total" field, but it is NaN.',
			),
		);
	});

	test("empty item description should throw an error", () => {
		const invalidItemDescriptionReceipt = {
			retailer: "Target",
			purchaseDate: "2022-01-01",
			purchaseTime: "13:01",
			items: [
				{
					shortDescription: "",
					price: "6.49",
				},
				{
					shortDescription: "Emils Cheese Pizza",
					price: "12.25",
				},
				{
					shortDescription: "Knorr Creamy Chicken",
					price: "1.26",
				},
				{
					shortDescription: "Doritos Nacho Cheese",
					price: "3.35",
				},
				{
					shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
					price: "12.00",
				},
			],
			total: "35.35",
		};

		expect(() => new Receipt(invalidItemDescriptionReceipt)).toThrowError(
			new InvalidReceiptFieldError(
				'Receipt item field "shortDescription" missing or empty.',
			),
		);
	});

	test("invalid item price should throw an error", () => {
		const invalidItemPriceReceipt = {
			retailer: "Target",
			purchaseDate: "2022-01-01",
			purchaseTime: "13:01",
			items: [
				{
					shortDescription: "Mountain Dew 12PK",
					price: "not a number",
				},
				{
					shortDescription: "Emils Cheese Pizza",
					price: "12.25",
				},
				{
					shortDescription: "Knorr Creamy Chicken",
					price: "1.26",
				},
				{
					shortDescription: "Doritos Nacho Cheese",
					price: "3.35",
				},
				{
					shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
					price: "12.00",
				},
			],
			total: "35.35",
		};

		expect(() => new Receipt(invalidItemPriceReceipt)).toThrowError(
			new InvalidReceiptFieldError(
				'Tried to parse "price" field, but it is NaN.',
			),
		);
	});
});
