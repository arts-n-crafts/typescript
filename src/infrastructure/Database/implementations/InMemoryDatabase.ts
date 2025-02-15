import type { Specification } from "../../../domain/Specification/Specification";
import { Operation, type Database, type DatabaseRecord, type Statement } from "../Database";
import { DuplicateRecordException, RecordNotFoundException } from "../Database.exceptions";

export class InMemoryDatabase implements Database {
  private readonly datasource = new Map<string, DatabaseRecord[]>();

  async query<T>(tableName: string, spec: Specification): Promise<T[]> {
    const data = this.datasource.get(tableName);
    if (!data) throw new Error(`Table ${tableName.toString()} not found`);

    const entry = spec.toQuery()[0]
    const [key, value] = Object.entries(entry).flat();

    // @TODO: fix type casting here
    return data.filter((record: DatabaseRecord) => {
      return record[key as unknown as keyof typeof record] === value
    }) as T[];
  }

  async execute(tableName: string, statement: Statement): Promise<void> {
    if (!this.datasource.has(tableName)) this.datasource.set(tableName, []);
    const table = this.datasource.get(tableName)!;

    if (statement.operation === Operation.CREATE) {
      const isDuplicate = table.some((item) => item.id === statement.payload.id)
      if (isDuplicate) throw new DuplicateRecordException(statement.payload.id);
      table.push(statement.payload);
      return;
    }
    if (statement.operation === Operation.UPDATE) {
      const index = table.findIndex((item) => item.id === statement.payload.id);
      if (index === -1) throw new RecordNotFoundException(statement.payload.id);
      table[index] = statement.payload
      return;
    }
    if (statement.operation === Operation.DELETE) {
      const index = table.findIndex((item) => item === statement.payload);
      if (index === -1)  throw new RecordNotFoundException(statement.payload.id);
      table.splice(index, 1);
      return;
    }
  }
}
