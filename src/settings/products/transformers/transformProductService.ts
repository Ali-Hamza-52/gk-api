export function transformProductService(item: any) {
  return {
    id: item.id,
    name: item.name,
    name_ar: item.name_ar,
    status: item.status,
    type: item.type,
    price: item.price,
    product_variations: item.product_variations
      ? JSON.parse(item.product_variations)
      : null,
    thumbnail: item.thumbnail,
    price_type: item.price_type,
    inventory_unit: item.inventory_unit,
    availability_in_outlets: item.availability_in_outlets,
    category_id: item.category_id,
    category_name: item.category?.title || '',
    category: item.category || '',
    barcode_type: item.barcode_type,
    barcode: item.barcode,
    sku: item.sku,
    pos_status: item.pos_status,
    stock_control: item.stock_control,
    purchase_unit_id: item.purchase_unit_id,
    consumption_unit_id: item.consumption_unit_id,
    purchase_unit: item.purchase_unit || null,
    consumption_unit: item.consumption_unit || null,
    outlets: item.outlets || null,
  };
}
