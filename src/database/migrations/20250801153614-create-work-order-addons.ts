// src/database/migrations/20250731000001-create-work-order-addons-table.ts

import { QueryInterface, DataTypes } from 'sequelize';

export = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('work_order_addons', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'Primary key',
      },
      work_order_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: 'Reference to work_orders table',
        references: {
          model: 'work_orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      addon_type: {
        type: DataTypes.ENUM('Platform', 'Crane', 'Transport', 'Custom'),
        allowNull: false,
        comment: 'Type of addon: Platform, Crane, Transport, Custom',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Description of the addon',
      },
      price: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: false,
        comment: 'Price excluding VAT',
        validate: {
          min: 0,
        },
      },
      approved_by_client: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        comment: 'Client approval status, defaults to false',
      },
      approved_by_userid: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        comment: 'User who approved the addon',
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      approved_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Timestamp when addon was approved',
      },
      created_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        comment: 'User who created the record',
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      updated_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        comment: 'User who last updated the record',
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Record creation timestamp',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Record last update timestamp',
      },
    });

    // Add indexes for better performance
    await queryInterface.addIndex('work_order_addons', ['work_order_id'], {
      name: 'idx_work_order_addons_work_order_id',
    });

    await queryInterface.addIndex('work_order_addons', ['addon_type'], {
      name: 'idx_work_order_addons_addon_type',
    });

    await queryInterface.addIndex('work_order_addons', ['approved_by_client'], {
      name: 'idx_work_order_addons_approved_by_client',
    });

    await queryInterface.addIndex('work_order_addons', ['price'], {
      name: 'idx_work_order_addons_price',
    });

    await queryInterface.addIndex('work_order_addons', ['created_at'], {
      name: 'idx_work_order_addons_created_at',
    });

    // Composite index for work order and addon type filtering
    await queryInterface.addIndex(
      'work_order_addons',
      ['work_order_id', 'addon_type'],
      {
        name: 'idx_work_order_addons_wo_addon_type_composite',
      },
    );

    // Composite index for approval and price queries (for summary statistics)
    await queryInterface.addIndex(
      'work_order_addons',
      ['approved_by_client', 'price'],
      {
        name: 'idx_work_order_addons_approval_price_composite',
      },
    );
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    // Drop indexes first
    await queryInterface.removeIndex(
      'work_order_addons',
      'idx_work_order_addons_approval_price_composite',
    );
    await queryInterface.removeIndex(
      'work_order_addons',
      'idx_work_order_addons_wo_addon_type_composite',
    );
    await queryInterface.removeIndex(
      'work_order_addons',
      'idx_work_order_addons_created_at',
    );
    await queryInterface.removeIndex(
      'work_order_addons',
      'idx_work_order_addons_price',
    );
    await queryInterface.removeIndex(
      'work_order_addons',
      'idx_work_order_addons_approved_by_client',
    );
    await queryInterface.removeIndex(
      'work_order_addons',
      'idx_work_order_addons_addon_type',
    );
    await queryInterface.removeIndex(
      'work_order_addons',
      'idx_work_order_addons_work_order_id',
    );

    // Drop table
    await queryInterface.dropTable('work_order_addons');
  },
};
