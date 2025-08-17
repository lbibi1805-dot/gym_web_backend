// TypeScript type definitions

export type ApiResponse<T = unknown> = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
};

export type PaginatedResponse<T> = {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export type FilterQuery = {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
};
