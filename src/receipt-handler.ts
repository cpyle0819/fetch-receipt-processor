import type { NextFunction, Request, Response } from "express";
import type { Storage } from "./storage";

export class ReceiptHandler {
	constructor(private storage: Storage) {}

	async handleProcessReceipts(req: Request, res: Response, next: NextFunction) {
		// TODO: Handle validation here.
		const { id } = await this.storage.write(req.body);
		res.json({ id });
	}

	async handleGetPoints(req: Request, res: Response, next: NextFunction) {
		// TODO: Handle validation here.
		try {
			const receipt = await this.storage.read(req.params.receipt);
			res.json(receipt);
		} catch (error) {
			next(error);
		}
	}
}
