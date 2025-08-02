'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.showAllTables().then((tables) => {
      return tables.includes('work_orders');
    });

    if (!tableExists) {
      // Create complete work_orders table
      console.log('📋 Creating work_orders table...');
      
      await queryInterface.createTable('work_orders', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT.UNSIGNED,
          comment: 'Primary key for work orders',
        },
        work_order_code: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
          comment: 'Auto-generated format: WO-ClientCode-LocationID-RecordID',
        },
        work_order_value: {
          type: Sequelize.BIGINT,
          allowNull: false,
          comment: 'Auto Calculate',
          defaultValue: 0,
        },
        client_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          comment: 'Reference to clients table',
        },
        location_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          comment: 'Reference to client_locations table',
        },
        contract_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          defaultValue: null,
          comment: 'Contract ID (not a foreign key constraint)',
        },
        request_type: {
          type: Sequelize.TINYINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          comment: '0 = Open (Diagnostic), 1 = Service Task',
        },
        priority: {
          type: Sequelize.TINYINT.UNSIGNED,
          allowNull: false,
          defaultValue: 3,
          comment: '1-Critical, 2-High, 3-Medium, 4-Low, 5-Routine',
        },
        contact_person: {
          type: Sequelize.STRING(100),
          allowNull: true,
          defaultValue: null,
          comment: 'Contact person name for this work order',
        },
        contact_number: {
          type: Sequelize.STRING(50),
          allowNull: true,
          defaultValue: null,
          comment: 'Contact phone number in international format',
        },
        requested_by: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          comment: 'User ID who requested the work order',
        },
        status: {
          type: Sequelize.ENUM(
            'Requested',
            'Diagnosed', 
            'In-Progress',
            'Completed',
            'Rejected',
            'Rework',
            'Warranty',
          ),
          allowNull: false,
          defaultValue: 'Requested',
          comment: 'Current status of the work order',
        },
        assigned_technician: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          defaultValue: null,
          comment: 'Assigned technician user ID',
        },
        diagnosis_timestamp: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null,
          comment: 'Timestamp when diagnosis was completed',
        },
        scheduled_timestamp: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null,
          comment: 'Scheduled date and time for service',
        },
        scheduled_date: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null,
          comment: 'Scheduled date for service',
        },
        sla_due_at: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null,
          comment: 'SLA deadline timestamp',
        },
        completed_at: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null,
          comment: 'Completion timestamp',
        },
        feedback_rating: {
          type: Sequelize.TINYINT.UNSIGNED,
          allowNull: true,
          defaultValue: null,
          comment: 'Feedback rating from 1-5',
        },
        feedback_comments: {
          type: Sequelize.TEXT,
          allowNull: true,
          defaultValue: null,
          comment: 'Customer feedback comments',
        },
        reopened_as_warranty: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          comment: 'Whether this work order was reopened as warranty',
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
          defaultValue: null,
          comment: 'Internal notes for the work order',
        },
        created_by: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          comment: 'User ID who created this record',
        },
        updated_by: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          defaultValue: null,
          comment: 'User ID who last updated this record',
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          comment: 'Record creation timestamp',
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
          comment: 'Record last update timestamp',
        },
      });

      // Add indexes
      await queryInterface.addIndex('work_orders', ['work_order_code'], {
        unique: true,
        name: 'idx_work_orders_code_unique',
      });

      await queryInterface.addIndex('work_orders', ['work_order_value'], {
        name: 'idx_work_orders_value',
      });

      await queryInterface.addIndex('work_orders', ['client_id'], {
        name: 'idx_work_orders_client_id',
      });

      await queryInterface.addIndex('work_orders', ['location_id'], {
        name: 'idx_work_orders_location_id',
      });

      await queryInterface.addIndex('work_orders', ['status'], {
        name: 'idx_work_orders_status',
      });

      console.log('✅ Work orders table created successfully');
      
    } else {
      // Table exists, add missing fields
      console.log('📋 Table exists, adding missing fields...');
      
      const tableDescription = await queryInterface.describeTable('work_orders');
      
      // Add work_order_value field if missing
      if (!tableDescription.work_order_value) {
        await queryInterface.addColumn('work_orders', 'work_order_value', {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
          comment: 'Auto Calculate',
        });
        console.log('✅ Added work_order_value field');
      }

      // Add scheduled_date field if missing
      if (!tableDescription.scheduled_date) {
        await queryInterface.addColumn('work_orders', 'scheduled_date', {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null,
          comment: 'Scheduled date for service',
        });
        console.log('✅ Added scheduled_date field');
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('work_orders');
  },
};