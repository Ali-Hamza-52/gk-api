import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('product_service_lists', {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      name_ar: DataTypes.STRING,
      status: DataTypes.STRING,
      type: DataTypes.STRING,
      price: DataTypes.FLOAT,
      product_variations: DataTypes.TEXT,
      thumbnail: DataTypes.STRING,
      price_type: DataTypes.STRING,
      barcode_type: DataTypes.STRING,
      barcode: DataTypes.STRING,
      sku: DataTypes.STRING,
      pos_status: DataTypes.STRING,
      stock_control: DataTypes.TINYINT,
      inventory_unit: DataTypes.STRING,

      category_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      purchase_unit_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      consumption_unit_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      availability_in_outlets: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },

      created_by: DataTypes.BIGINT.UNSIGNED,
      updated_by: DataTypes.BIGINT.UNSIGNED,
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('product_service_lists');
  },
};
