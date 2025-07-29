import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  const tablesToCheck = [
    'users',
    'vendor_base',
    'materials',
    'material_categories',
    'asset_makes',
    'asset_capacities',
    'profession_base',
    'supplier_types',
    'supplier_items',
    'client_base',
    'client_services',
    'client_locations',
    'employee_base',
    'accommodation_base',
    'accommodation_payments',
    'assets_managments',
    'permissions',
    'requests_logs',
  ];

  for (const tableName of tablesToCheck) {
    try {
      const tableInfo = await queryInterface.describeTable(tableName);

      if (!tableInfo.created_at) {
        console.log(`Adding created_at to ${tableName}`);
        await queryInterface.addColumn(tableName, 'created_at', {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: DataTypes.NOW,
        });
      }

      if (!tableInfo.updated_at) {
        console.log(`Adding updated_at to ${tableName}`);
        await queryInterface.addColumn(tableName, 'updated_at', {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: DataTypes.NOW,
        });
      }
    } catch (error) {
      console.log(`Skipping table ${tableName}: ${error.message}`);
    }
  }
};

export const down = async (queryInterface: QueryInterface) => {
  const tablesToCheck = [
    'users',
    'vendor_base',
    'materials',
    'material_categories',
    'asset_makes',
    'asset_capacities',
    'profession_base',
    'supplier_types',
    'supplier_items',
    'client_base',
    'client_services',
    'client_locations',
    'employee_base',
    'accommodation_base',
    'accommodation_payments',
    'assets_managments',
    'permissions',
    'requests_logs',
  ];

  for (const tableName of tablesToCheck) {
    try {
      const tableInfo = await queryInterface.describeTable(tableName);

      if (tableInfo.created_at) {
        await queryInterface.removeColumn(tableName, 'created_at');
      }
      if (tableInfo.updated_at) {
        await queryInterface.removeColumn(tableName, 'updated_at');
      }
    } catch (error) {
      console.log(`Skipping table ${tableName}: ${error.message}`);
    }
  }
};
