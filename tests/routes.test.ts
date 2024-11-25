import { describe, expect, test } from "bun:test";
import supertest from "supertest";

import { app } from "../src";

describe("/receipts/:receipt/points", () => {
	test("not found", async () => {
		const { status } = await supertest(app).get("/receipts/123/points");
		expect(status).toBe(404);
	});

	test("found", async () => {
		const storedValue = { emoji: "🐕" };
		const agent = supertest(app);
		const {
			body: { id },
		} = await agent.post("/receipts/process").send(storedValue);
		const {
			body: { value },
		} = await agent.get(`/receipts/${id}/points`);
		expect(value).toEqual(storedValue);
	});
});
