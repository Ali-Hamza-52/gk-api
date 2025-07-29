import { Model, FindOptions, ModelStatic } from 'sequelize';

export interface PaginationOptions {
  page?: number;
  perPage?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: {
    total: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
  };
}

export async function paginateQuery<T extends Model>(
  model: ModelStatic<T>,
  options: FindOptions & PaginationOptions,
): Promise<PaginatedResult<T>> {
  const { page = 1, perPage = 10, ...findOptions } = options;
  const offset = (page - 1) * perPage;
  const limit = perPage;

  const { rows, count } = await model.findAndCountAll({
    ...findOptions,
    offset,
    limit,
  });

  return {
    items: rows,
    meta: {
      total: count,
      currentPage: page,
      perPage,
      totalPages: Math.ceil(count / perPage),
    },
  };
}
