import { describe, expect, test } from "bun:test";
import supertest from "supertest";

import { app } from "../src";

describe("/receipts/:receipt/points", () => {
	test("not found", async () => {
		const { status } = await supertest(app).get("/receipts/123/points");
		expect(status).toBe(404);
	});

	test("example receipt 1", async () => {
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
		const agent = supertest(app);
		const {
			body: { id },
		} = await agent.post("/receipts/process").send(validReceipt);
		const {
			body: { points },
		} = await agent.get(`/receipts/${id}/points`);
		expect(points).toEqual(28);
	});

	test("example receipt 2", async () => {
		const validReceipt = {
			retailer: "M&M Corner Market",
			purchaseDate: "2022-03-20",
			purchaseTime: "14:33",
			items: [
				{
					shortDescription: "Gatorade",
					price: "2.25",
				},
				{
					shortDescription: "Gatorade",
					price: "2.25",
				},
				{
					shortDescription: "Gatorade",
					price: "2.25",
				},
				{
					shortDescription: "Gatorade",
					price: "2.25",
				},
			],
			total: "9.00",
		};
		const agent = supertest(app);
		const {
			body: { id },
		} = await agent.post("/receipts/process").send(validReceipt);
		const {
			body: { points },
		} = await agent.get(`/receipts/${id}/points`);
		expect(points).toEqual(109);
	});
});
