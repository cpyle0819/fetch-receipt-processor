import { uuid } from "./random";

export type StorageRecord = {
	id: string;
	value: unknown;
};

export interface Storage {
	read(id: string): Promise<StorageRecord>;
	write<T>(value: NonNullable<T>): Promise<StorageRecord>;
}

export class StorageError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "StorageError";
	}
}

export class RecordNotFoundError extends StorageError {
	constructor(public readonly id: string) {
		const message = `Record for id "${id}" not found.`;
		super(message);
		this.name = "RecordNotFoundError";
	}
}

/**
 * In-memory implementation
 */
export class MemoryStorage implements Storage {
	// MemoryStorage indexes records by id. Since records will be primarily
	// fetched (see what I did there?) by id, this index will support fast
	// retrieval.
	constructor(private store: Record<StorageRecord["id"], StorageRecord> = {}) {}

	async read(id: string): Promise<StorageRecord> {
		const record = this.store[id];
		if (typeof record === "undefined") {
			throw new RecordNotFoundError(id);
		}
		return record;
	}

	// Unique id is generated on write.
	async write<T>(value: NonNullable<T>): Promise<StorageRecord> {
		const id = uuid();
		const record = { id, value };
		this.store[id] = record;
		return record;
	}
}
