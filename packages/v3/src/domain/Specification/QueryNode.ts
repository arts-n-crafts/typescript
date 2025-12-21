import type { Primitive } from '@core/types/Primitive.ts'

export type QueryNode
  = | { type: 'eq' | 'gt' | 'lt', field: string | number | symbol, value: Primitive }
    | { type: 'and' | 'or', nodes: QueryNode[] }
    | { type: 'not', node: QueryNode }
