// src/database/migrations/20250731000000-create-work-order-parts-table.ts

import { QueryInterface, DataTypes } from 'sequelize';

export = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('work_order_parts', {
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
      work_order_service_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: 'Reference to work_order_services table',
        references: {
          model: 'work_order_services',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      part_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: 'Reference to materials table',
        references: {
          model: 'materials',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: 'Number of units used',
        validate: {
          min: 1,
        },
      },
      unit_price: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: false,
        comment: 'Unit price excluding VAT',
        validate: {
          min: 0,
        },
      },
      total_price: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: true,
        comment: 'Calculated as quantity * unit_price',
      },
      warranty_duration: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: 'Warranty duration in days',
      },
      supplier_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        comment: 'Reference to suppliers table',
        references: {
          model: 'suppliers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      approved_by_client: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Client approval status, defaults to false',
      },
      approved_by_userid: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        comment: 'User who approved the part',
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
        comment: 'Timestamp when part was approved',
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
    await queryInterface.addIndex('work_order_parts', ['work_order_id'], {
      name: 'idx_work_order_parts_work_order_id',
    });

    await queryInterface.addIndex(
      'work_order_parts',
      ['work_order_service_id'],
      {
        name: 'idx_work_order_parts_work_order_service_id',
      },
    );

    await queryInterface.addIndex('work_order_parts', ['part_id'], {
      name: 'idx_work_order_parts_part_id',
    });

    await queryInterface.addIndex('work_order_parts', ['supplier_id'], {
      name: 'idx_work_order_parts_supplier_id',
    });

    await queryInterface.addIndex('work_order_parts', ['approved_by_client'], {
      name: 'idx_work_order_parts_approved_by_client',
    });

    await queryInterface.addIndex('work_order_parts', ['created_at'], {
      name: 'idx_work_order_parts_created_at',
    });

    await queryInterface.addIndex('work_order_parts', ['total_price'], {
      name: 'idx_work_order_parts_total_price',
    });

    // Composite index for work order and service relationship
    await queryInterface.addIndex(
      'work_order_parts',
      ['work_order_id', 'work_order_service_id'],
      {
        name: 'idx_work_order_parts_wo_service_composite',
      },
    );

    // Composite index for approval queries
    await queryInterface.addIndex(
      'work_order_parts',
      ['approved_by_client', 'total_price'],
      {
        name: 'idx_work_order_parts_approval_price_composite',
      },
    );
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    // Drop indexes first
    await queryInterface.removeIndex(
      'work_order_parts',
      'idx_work_order_parts_approval_price_composite',
    );
    await queryInterface.removeIndex(
      'work_order_parts',
      'idx_work_order_parts_wo_service_composite',
    );
    await queryInterface.removeIndex(
      'work_order_parts',
      'idx_work_order_parts_total_price',
    );
    await queryInterface.removeIndex(
      'work_order_parts',
      'idx_work_order_parts_created_at',
    );
    await queryInterface.removeIndex(
      'work_order_parts',
      'idx_work_order_parts_approved_by_client',
    );
    await queryInterface.removeIndex(
      'work_order_parts',
      'idx_work_order_parts_supplier_id',
    );
    await queryInterface.removeIndex(
      'work_order_parts',
      'idx_work_order_parts_part_id',
    );
    await queryInterface.removeIndex(
      'work_order_parts',
      'idx_work_order_parts_work_order_service_id',
    );
    await queryInterface.removeIndex(
      'work_order_parts',
      'idx_work_order_parts_work_order_id',
    );

    // Drop table
    await queryInterface.dropTable('work_order_parts');
  },
};
