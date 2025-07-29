// migrations/20250711-create-product-service-categories.js
'use strict';
module.exports = {
  async up(qi, Seq) {
    await qi.createTable('product_service_categories', {
      id: { type: Seq.BIGINT, primaryKey: true, autoIncrement: true },
      title: { type: Seq.STRING, allowNull: false },
      title_ar: { type: Seq.STRING, allowNull: false },
      icon: { type: Seq.STRING, allowNull: true },
      created_by: Seq.INTEGER,
      updated_by: Seq.INTEGER,
      created_at: Seq.DATE,
      updated_at: Seq.DATE,
    });
  },
  async down(qi) {
    await qi.dropTable('product_service_categories');
  },
};
