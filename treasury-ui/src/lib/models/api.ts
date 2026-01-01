export type ApiResponse<T = unknown> = {
    data: T;
}

export type PaginatedResponse<T = unknown> = {
    meta: {
        total: number;
        pages: number;
        hasNext: boolean;
    }
} & ApiResponse<T>