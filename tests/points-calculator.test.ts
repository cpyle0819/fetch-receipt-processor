import { describe, expect, test } from "bun:test";
import { PointsCalculator } from "../src/points-calculator";
import { Receipt } from "../src/receipt";

describe("PointsCalculator", () => {
	describe("pointRetailer", () => {
		test("should give one point per alphanumeric character", () => {
			const validReceipt = {
				retailer: "Target123",
				purchaseDate: "2022-01-01",
				purchaseTime: "13:01",
				items: [
					{
						shortDescription: "Mountain Dew 12PK",
						price: "6.49",
					},
				],
				total: "35.35",
			};

			const receipt = new Receipt(validReceipt);
			const calc = new PointsCalculator(receipt);
			expect(calc.pointRetailer()).toBe(9);
		});

		test("should not count whitespace", () => {
			const validReceipt = {
				retailer: "  Tar  ge t  ",
				purchaseDate: "2022-01-01",
				purchaseTime: "13:01",
				items: [
					{
						shortDescription: "Mountain Dew 12PK",
						price: "6.49",
					},
				],
				total: "35.35",
			};

			const receipt = new Receipt(validReceipt);
			const calc = new PointsCalculator(receipt);
			expect(calc.pointRetailer()).toBe(6);
		});

		test("should not count non-alphanumeric characters", () => {
			const validReceipt = {
				retailer: "  T##ar & ge !t  ",
				purchaseDate: "2022-01-01",
				purchaseTime: "13:01",
				items: [
					{
						shortDescription: "Mountain Dew 12PK",
						price: "6.49",
					},
				],
				total: "35.35",
			};

			const receipt = new Receipt(validReceipt);
			const calc = new PointsCalculator(receipt);
			expect(calc.pointRetailer()).toBe(6);
		});
	});

	describe("pointTotal", () => {
		test("should be 75 points if the total is a round dollar amount with no cents", () => {
			const validReceipt = {
				retailer: "Target",
				purchaseDate: "2022-01-01",
				purchaseTime: "13:01",
				items: [
					{
						shortDescription: "Mountain Dew 12PK",
						price: "6.49",
					},
				],
				total: "35.00",
			};

			const receipt = new Receipt(validReceipt);
			const calc = new PointsCalculator(receipt);
			expect(calc.pointTotal()).toBe(75);
		});

		test("should be 25 points if the total is not a round dollar amount but is a multiple of .25", () => {
			const validReceipt = {
				retailer: "Target",
				purchaseDate: "2022-01-01",
				purchaseTime: "13:01",
				items: [
					{
						shortDescription: "Mountain Dew 12PK",
						price: "6.49",
					},
				],
				total: "35.50",
			};

			const receipt = new Receipt(validReceipt);
			const calc = new PointsCalculator(receipt);
			expect(calc.pointTotal()).toBe(25);
		});

		test("should be 0 points if the total is not a round dollar amount and is not a multiple of .25", () => {
			const validReceipt = {
				retailer: "Target",
				purchaseDate: "2022-01-01",
				purchaseTime: "13:01",
				items: [
					{
						shortDescription: "Mountain Dew 12PK",
						price: "6.49",
					},
				],
				total: "35.12",
			};

			const receipt = new Receipt(validReceipt);
			const calc = new PointsCalculator(receipt);
			expect(calc.pointTotal()).toBe(0);
		});
	});

	describe("pointItems", () => {
		test("should be 5 points if there are 2 items on the receipt.", () => {
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
						shortDescription: "Fetch Swag",
						price: "22.43",
					},
				],
				total: "28.92",
			};

			const receipt = new Receipt(validReceipt);
			const calc = new PointsCalculator(receipt);
			expect(calc.pointItems()).toBe(5);
		});
		test("should be 5 points if there are 3 items on the receipt.", () => {
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
						shortDescription: "Fetch Swag",
						price: "22.43",
					},
					{
						shortDescription: "Gum",
						price: "1.00",
					},
				],
				total: "29.92",
			};

			const receipt = new Receipt(validReceipt);
			const calc = new PointsCalculator(receipt);
			expect(calc.pointItems()).toBe(5);
		});
		test("should be 10 points if there are 4 items on the receipt.", () => {
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
						shortDescription: "Fetch Swag",
						price: "22.43",
					},
					{
						shortDescription: "Gum",
						price: "1.00",
					},
					{
						shortDescription: "Coffee",
						price: "1.00",
					},
				],
				total: "30.92",
			};

			const receipt = new Receipt(validReceipt);
			const calc = new PointsCalculator(receipt);
			expect(calc.pointItems()).toBe(10);
		});
		test("should be 10 points if there are 5 items on the receipt.", () => {
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
						shortDescription: "Fetch Swag",
						price: "22.43",
					},
					{
						shortDescription: "Gum",
						price: "1.00",
					},
					{
						shortDescription: "Coffee",
						price: "1.00",
					},
					{
						shortDescription: "Coffee",
						price: "1.00",
					},
				],
				total: "30.92",
			};

			const receipt = new Receipt(validReceipt);
			const calc = new PointsCalculator(receipt);
			expect(calc.pointItems()).toBe(10);
		});
	});

	describe("pointItemDescriptions", () => {
		const cases = [
			[5, "23", 1],
			[45, "23", 9],
			[230, "111.22", 10],
		];
		test.each(cases)(
			"should be %p if the item price is %p, there's %p item(s), and the description length of every item is a multiple of 3",
			(expectedPoints, itemPrice, countItems) => {
				const validReceipt = {
					retailer: "Target",
					purchaseDate: "2022-01-01",
					purchaseTime: "13:01",
					items: [...Array(countItems).keys()].map(() => ({
						shortDescription: "aaa",
						price: itemPrice,
					})),
					total: "27.50",
				};

				const receipt = new Receipt(validReceipt);
				const calc = new PointsCalculator(receipt);
				expect(calc.pointItemDescriptions()).toBe(expectedPoints as number);
			},
		);

		test("should not give points for item descriptions whose lengths are not multiples of 3", () => {
			const validReceipt = {
				retailer: "Target",
				purchaseDate: "2022-01-01",
				purchaseTime: "13:01",
				items: [
					{
						shortDescription: "aaaa",
						price: "1.00",
					},
				],
				total: "10",
			};

			const receipt = new Receipt(validReceipt);
			const calc = new PointsCalculator(receipt);
			expect(calc.pointItemDescriptions()).toBe(0);
		});
	});

	describe("pointDate", () => {
		test("should give 6 points if day in date is odd", () => {
			const validReceipt = {
				retailer: "Target",
				purchaseDate: "2022-01-01",
				purchaseTime: "13:01",
				items: [
					{
						shortDescription: "aaaa",
						price: "1.00",
					},
				],
				total: "10",
			};

			const receipt = new Receipt(validReceipt);
			const calc = new PointsCalculator(receipt);
			expect(calc.pointDate()).toBe(6);
		});

		test("should give no points if day in date is even", () => {
			const validReceipt = {
				retailer: "Target",
				purchaseDate: "2022-01-02",
				purchaseTime: "13:01",
				items: [
					{
						shortDescription: "aaaa",
						price: "1.00",
					},
				],
				total: "10",
			};

			const receipt = new Receipt(validReceipt);
			const calc = new PointsCalculator(receipt);
			expect(calc.pointDate()).toBe(0);
		});
	});

	describe("pointTime", () => {
		test("should give 10 points if time is between 2:00PM and 4:00PM", () => {
			const validReceipt = {
				retailer: "Target",
				purchaseDate: "2022-01-02",
				purchaseTime: "14:01",
				items: [
					{
						shortDescription: "aaaa",
						price: "1.00",
					},
				],
				total: "10",
			};

			const receipt = new Receipt(validReceipt);
			const calc = new PointsCalculator(receipt);
			expect(calc.pointTime()).toBe(10);
		});

		test("should give no points if time is not between 2:00PM and 4:00PM", () => {
			const validReceipt = {
				retailer: "Target",
				purchaseDate: "2022-01-02",
				purchaseTime: "12:01",
				items: [
					{
						shortDescription: "aaaa",
						price: "1.00",
					},
				],
				total: "10",
			};

			const receipt = new Receipt(validReceipt);
			const calc = new PointsCalculator(receipt);
			expect(calc.pointTime()).toBe(0);
		});

		test("should give no points if time is 4:00PM", () => {
			const validReceipt = {
				retailer: "Target",
				purchaseDate: "2022-01-02",
				purchaseTime: "16:00",
				items: [
					{
						shortDescription: "aaaa",
						price: "1.00",
					},
				],
				total: "10",
			};

			const receipt = new Receipt(validReceipt);
			const calc = new PointsCalculator(receipt);
			expect(calc.pointTime()).toBe(0);
		});

		test("should give 10 points if time is 2:00PM", () => {
			const validReceipt = {
				retailer: "Target",
				purchaseDate: "2022-01-02",
				purchaseTime: "14:00",
				items: [
					{
						shortDescription: "aaaa",
						price: "1.00",
					},
				],
				total: "10",
			};

			const receipt = new Receipt(validReceipt);
			const calc = new PointsCalculator(receipt);
			expect(calc.pointTime()).toBe(10);
		});
	});
});
