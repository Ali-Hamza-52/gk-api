export function transformMaterial(item: any) {
  return {
    id: item.id,
    name: item.name,
    name_ar: item.name_ar,
    status: item.status,
    description: item.description,
    purchase_unit_id: item.purchase_unit_id,
    consumption_unit_id: item.consumption_unit_id,
    category_id: item.category_id,
    conversion_ratio: item.conversion_ratio,
    re_order_qty: item.re_order_qty,
    stock_control: item.stock_control,
    purchase_unit: item.purchase_unit || null,
    consumption_unit: item.consumption_unit || null,
    category: item.category || null,
    created_by: item.created_by,
    updated_by: item.updated_by,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}
