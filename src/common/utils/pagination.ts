export function paginateArray(array: any[], page = 1, perPage = 10) {
  const offset = (page - 1) * perPage;
  const paginatedItems = array.slice(offset, offset + perPage);

  return {
    items: paginatedItems,
    meta: {
      total: array.length,
      currentPage: page,
      perPage,
      totalPages: Math.ceil(array.length / perPage),
    },
  };
}
