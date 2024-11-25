import express from "express";

import { storageErrorHandler } from "./errors-handlers.ts";
import { ReceiptHandler } from "./receipt-handler.ts";
import { MemoryStorage } from "./storage.ts";

const storage = new MemoryStorage();
const receiptHandler = new ReceiptHandler(storage);
const port = 3000;
const app = express();

// Body parsing
app.use(express.json());

// Routes
app.post(
	"/receipts/process",
	receiptHandler.handleProcessReceipts.bind(receiptHandler),
);
app.get(
	"/receipts/:receipt/points",
	receiptHandler.handleGetPoints.bind(receiptHandler),
);

// Errors
app.use(storageErrorHandler);

// Start listening
app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});

export { app };
