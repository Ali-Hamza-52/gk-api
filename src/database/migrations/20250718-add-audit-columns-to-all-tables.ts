import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  const tablesToUpdate = [
    'SequelizeMeta',
    'accommodation_bill_payments',
    'accommodation_resources',
    'allocated_resources_accommodation_items',
    'allocated_resources_employee_items',
    'allocated_resources_project_items',
    'audits',
    'banks',
    'cities',
    'client_locations',
    'client_services',
    'creditNote_expense',
    'debitNote_expense',
    'employee_resources',
    'employees',
    'error_logs',
    'estimate_items',
    'failed_jobs',
    'history_records',
    'migrations',
    'model_has_permissions',
    'model_has_roles',
    'nationalities',
    'order_assets',
    'order_items',
    'order_items_addons',
    'password_resets',
    'patty_cash_items',
    'permissions',
    'pos_order_items',
    'pos_order_list',
    'product_service_lists',
    'profession_base',
    'project_resources',
    'quotation_equipment_rentals',
    'quotation_equipment_rentals_development',
    'quotation_operation_services',
    'quotation_operation_services_development',
    'quotation_support_services',
    'requests_logs',
    'role_has_permissions',
    'roles',
    'sales_channels',
    'sales_order_dates',
    'settings',
    'short_url_visits',
    'short_urls',
    'sp_leaves',
    'split_payments',
    'supplier_items',
    'supplier_types',
    'task_categories',
    'task_user_pins',
    'tasks',
    'transaction_types',
    'user_levels',
    'user_widgets',
    'users',
    'vendor_base',
    'vendor_services',
    'widgets',
    'work_order_tasks',
  ];

  for (const tableName of tablesToUpdate) {
    try {
      const tableInfo = await queryInterface.describeTable(tableName);

      if (!tableInfo.created_by) {
        await queryInterface.addColumn(tableName, 'created_by', {
          type: DataTypes.BIGINT,
          allowNull: true,
        });
      }

      if (!tableInfo.updated_by) {
        await queryInterface.addColumn(tableName, 'updated_by', {
          type: DataTypes.BIGINT,
          allowNull: true,
        });
      }

      if (!tableInfo.created_at) {
        await queryInterface.addColumn(tableName, 'created_at', {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: DataTypes.NOW,
        });
      }

      if (!tableInfo.updated_at) {
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
  const tablesToUpdate = [
    'SequelizeMeta',
    'accommodation_bill_payments',
    'accommodation_resources',
    'allocated_resources_accommodation_items',
    'allocated_resources_employee_items',
    'allocated_resources_project_items',
    'audits',
    'banks',
    'cities',
    'client_locations',
    'client_services',
    'creditNote_expense',
    'debitNote_expense',
    'employee_resources',
    'employees',
    'error_logs',
    'estimate_items',
    'failed_jobs',
    'history_records',
    'migrations',
    'model_has_permissions',
    'model_has_roles',
    'nationalities',
    'order_assets',
    'order_items',
    'order_items_addons',
    'password_resets',
    'patty_cash_items',
    'permissions',
    'pos_order_items',
    'pos_order_list',
    'product_service_lists',
    'profession_base',
    'project_resources',
    'quotation_equipment_rentals',
    'quotation_equipment_rentals_development',
    'quotation_operation_services',
    'quotation_operation_services_development',
    'quotation_support_services',
    'requests_logs',
    'role_has_permissions',
    'roles',
    'sales_channels',
    'sales_order_dates',
    'settings',
    'short_url_visits',
    'short_urls',
    'sp_leaves',
    'split_payments',
    'supplier_items',
    'supplier_types',
    'task_categories',
    'task_user_pins',
    'tasks',
    'transaction_types',
    'user_levels',
    'user_widgets',
    'users',
    'vendor_base',
    'vendor_services',
    'widgets',
    'work_order_tasks',
  ];

  for (const tableName of tablesToUpdate) {
    try {
      const tableInfo = await queryInterface.describeTable(tableName);

      if (tableInfo.created_by) {
        await queryInterface.removeColumn(tableName, 'created_by');
      }
      if (tableInfo.updated_by) {
        await queryInterface.removeColumn(tableName, 'updated_by');
      }
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
