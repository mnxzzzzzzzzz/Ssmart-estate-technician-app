// Pagination Utility Functions

import { PaginationParams } from '../types/api.types';
import { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } from '../config/constants';

// Parse pagination parameters
export const parsePagination = (params: PaginationParams) => {
  const page = Math.max(1, params.page || DEFAULT_PAGE);
  const limit = Math.min(Math.max(1, params.limit || DEFAULT_LIMIT), MAX_LIMIT);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// Calculate pagination metadata
export const calculatePaginationMeta = (total: number, page: number, limit: number) => {
  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;

  return {
    page,
    limit,
    total,
    totalPages,
    hasMore,
  };
};

// Parse sort parameters
export const parseSort = (sortBy?: string, sortOrder?: 'asc' | 'desc') => {
  if (!sortBy) return undefined;

  return {
    [sortBy]: sortOrder || 'asc',
  };
};
