export function paginateArray<T>(
  items: T[],
  page: number,
  perPage: number,
): T[] {
  const offset = (page - 1) * perPage;
  return items.slice(offset, offset + perPage);
}
