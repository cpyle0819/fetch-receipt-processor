import type { NextFunction, Request, Response } from "express";
import { PointsCalculator } from "./points-calculator";
import { Receipt } from "./receipt";
import type { Storage } from "./storage";

export class ReceiptHandler {
	constructor(private storage: Storage) {}

	async handleProcessReceipts(req: Request, res: Response, next: NextFunction) {
		// TODO: Handle validation here.
		const { id } = await this.storage.write(req.body);
		res.json({ id });
	}

	async handleGetPoints(req: Request, res: Response, next: NextFunction) {
		try {
			const { value } = await this.storage.read(req.params.receipt);
			const receipt = new Receipt(value as Record<string, unknown>);
			const calc = new PointsCalculator(receipt);
			res.json({ points: calc.calculateTotal() });
		} catch (error) {
			next(error);
		}
	}
}
