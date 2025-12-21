import type { Primitive } from '@core/types/Primitive.ts'
import type { QueryNode } from '../QueryNode.ts'

export function createQueryNode(type: 'eq' | 'gt' | 'lt', field: string | number | symbol, value: Primitive): QueryNode
export function createQueryNode(type: 'and' | 'or', field: undefined, value: QueryNode[]): QueryNode
export function createQueryNode(type: 'not', field: undefined, value: QueryNode): QueryNode
export function createQueryNode(
  type: QueryNode['type'],
  field: string | number | symbol | undefined,
  value: Primitive | QueryNode | QueryNode[],
): QueryNode {
  switch (type) {
    case 'eq':
    case 'gt':
    case 'lt':
      return { type, field: field as string, value: value as Primitive }
    case 'and':
    case 'or':
      return { type, nodes: value as QueryNode[] }
    case 'not':
      return { type, node: value as QueryNode }
  }
}
