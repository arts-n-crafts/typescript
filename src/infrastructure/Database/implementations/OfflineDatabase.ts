import type { Specification } from '@domain/Specification/Specification.ts'
import type { Database, Statement } from '../Database.ts'

export class OfflineDatabase implements Database {
  constructor(
    private readonly allowQuery: boolean = false,
    private readonly allowWrite: boolean = false,
  ) {
  }

  async query<TReturnType>(_tableName: string, _specification: Specification): Promise<TReturnType> {
    if (!this.allowQuery) {
      throw new Error('Database read offline!')
    }
    return [] as TReturnType
  }

  async execute(_tableName: string, _statement: Statement): Promise<void> {
    if (!this.allowWrite) {
      throw new Error('Database write offline!')
    }
  }
}
