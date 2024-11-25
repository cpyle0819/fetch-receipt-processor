import type { NextFunction, Request, Response } from "express";
import { RecordNotFoundError } from "./storage";

export const storageErrorHandler = (
	err: unknown,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (err instanceof RecordNotFoundError) {
		res.status(404).send(err.message);
		return;
	}

	res.status(500).send("Server error");
};
