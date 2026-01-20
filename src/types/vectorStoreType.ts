type VectorSearchResult<TPayload = any> = {
    id: string | number;
    score: number;
    payload?: TPayload;
};
  
export type VectorStore<TPayload = any> = {
    embedText: (text: string) => Promise<number[]>;
    upsert: (id: string, vector: number[], payload?: any) => Promise<void>;
    search: (vector: number[], limit?: number, filter?: unknown) => Promise<VectorSearchResult<TPayload>[]>;
    delete: (id: string | number) => Promise<void>;
};