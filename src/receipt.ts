export class ReceiptError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ReceiptError";
    }
}

export class InvalidReceiptFieldError extends ReceiptError {
    constructor(detail: string) {
        const message = `Invalid field type for receipt. ${detail}`
        super(message);
        this.name = "InvalidReceiptFieldError";
    }
}

export class Receipt {
    retailer: string;
    date: Date;

    constructor(json: Record<string, unknown>) {
        this.retailer = this.buildRetailer(json);
        this.date = this.buildPurchaseDate(json);
        this.buildTotal(json);
        this.buildItems(json);
    }


    private buildRetailer(json: Record<string, unknown>) {
        if (!json.retailer) {
            throw new InvalidReceiptFieldError(`No "retailer" field found.`);
        }

        if (typeof json.retailer !== "string") {
            throw new InvalidReceiptFieldError(`Expected "retailer" field to be type of "string".`);
        }

        return json.retailer;
    }

    private buildPurchaseDate(json: Record<string, unknown>) {
        if (!json.date) {
            throw new InvalidReceiptFieldError(`No "date" field found.`);
        }

        if (!json.time) {
            throw new InvalidReceiptFieldError(`No "time" field found.`);
        }

        if (typeof json.date !== "string" || typeof json.time !== "string") {
            throw new InvalidReceiptFieldError(`Expected "date" and "time" fields to be type of "string".`);
        }

        // Assuming dates are in UTC?
        const date = new Date(`${json.date}T${json.time}`);

        if (date instanceof Date && !Number.isNaN(date)) {
            return date;
        }

        throw new InvalidReceiptFieldError(`Could not parse ${json.date} and ${json.time} into a valid date.`)
    }

    private buildTotal(json: Record<string, unknown>) {
        throw new Error("Method not implemented.");
    }

    private buildItems(json: Record<string, unknown>) {
        throw new Error("Method not implemented.");
    }
}
