


type PaginationOptions = {
    page?: number;
    limit?: number|string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}


type IOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

const calculatePagination = (options: PaginationOptions): IOptionsResult => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;    
  
  const sortBy: string = options.sortBy || 'createdAt';
    const sortOrder: 'asc' | 'desc' = options.sortOrder ||'desc';

    return {
        page,   
        limit,
        skip,
        sortBy,
        sortOrder,
    };
}

export default calculatePagination