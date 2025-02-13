export interface Database {
  query<T>(query: string): Promise<T[]>;
  execute(query: string): Promise<void>;
}
