'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if table exists
    const tableExists = await queryInterface.showAllTables().then(tables => {
      return tables.includes('work_orders');
    });

    if (!tableExists) {
      // Create table if it doesn't exist
      await queryInterface.createTable('work_orders', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT
        },
        work_order_code: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        client_id: {
          type: Sequelize.BIGINT,
          allowNull: false
        },
        location_id: {
          type: Sequelize.BIGINT,
          allowNull: false
        },
        request_type: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        contract_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        priority: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 3
        },
        contact_person: {
          type: Sequelize.STRING(100),
          allowNull: false,
          defaultValue: ''
        },
        contact_number: {
          type: Sequelize.STRING(50),
          allowNull: false,
          defaultValue: ''
        },
        requested_by: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0
        },
        status: {
          type: Sequelize.ENUM('REQUESTED', 'DIAGNOSED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REWORK', 'WARRANTY'),
          allowNull: false,
          defaultValue: 'REQUESTED'
        },
        assigned_technician: {
          type: Sequelize.BIGINT,
          allowNull: true
        },
        diagnosis_timestamp: {
          type: Sequelize.DATE,
          allowNull: true
        },
        sla_due_at: {
          type: Sequelize.DATE,
          allowNull: true  // Change to nullable to avoid MySQL strict mode issues
        },
        completed_at: {
          type: Sequelize.DATE,
          allowNull: true
        },
        feedback_rating: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        feedback_comments: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        reopened_as_warranty: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
        }
      });

      // Add indexes for new table
      await queryInterface.addIndex('work_orders', ['client_id']);
      await queryInterface.addIndex('work_orders', ['location_id']);
      await queryInterface.addIndex('work_orders', ['status']);
      await queryInterface.addIndex('work_orders', ['priority']);
      await queryInterface.addIndex('work_orders', ['requested_by']);
      await queryInterface.addIndex('work_orders', ['assigned_technician']);
      await queryInterface.addIndex('work_orders', ['work_order_code']);
    } else {
      // Table exists, check and add missing columns
      const tableDescription = await queryInterface.describeTable('work_orders');
      
      const columns = [
        {
          name: 'work_order_code',
          definition: {
            type: Sequelize.STRING(100),
            allowNull: true
          }
        },
        {
          name: 'client_id',
          definition: {
            type: Sequelize.BIGINT,
            allowNull: true  // Make nullable for existing data
          }
        },
        {
          name: 'location_id',
          definition: {
            type: Sequelize.BIGINT,
            allowNull: true  // Make nullable for existing data
          }
        },
        {
          name: 'request_type',
          definition: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
          }
        },
        {
          name: 'contract_id',
          definition: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
          }
        },
        {
          name: 'priority',
          definition: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 3
          }
        },
        {
          name: 'contact_person',
          definition: {
            type: Sequelize.STRING(100),
            allowNull: true,
            defaultValue: ''
          }
        },
        {
          name: 'contact_number',
          definition: {
            type: Sequelize.STRING(50),
            allowNull: true,
            defaultValue: ''
          }
        },
        {
          name: 'requested_by',
          definition: {
            type: Sequelize.BIGINT,
            allowNull: true,
            defaultValue: 0
          }
        },
        {
          name: 'assigned_technician',
          definition: {
            type: Sequelize.BIGINT,
            allowNull: true
          }
        },
        {
          name: 'diagnosis_timestamp',
          definition: {
            type: Sequelize.DATE,
            allowNull: true
          }
        },
        {
          name: 'sla_due_at',
          definition: {
            type: Sequelize.DATE,
            allowNull: true  // Make it nullable to avoid MySQL strict mode issues
          }
        },
        {
          name: 'completed_at',
          definition: {
            type: Sequelize.DATE,
            allowNull: true
          }
        },
        {
          name: 'feedback_rating',
          definition: {
            type: Sequelize.INTEGER,
            allowNull: true
          }
        },
        {
          name: 'feedback_comments',
          definition: {
            type: Sequelize.TEXT,
            allowNull: true
          }
        },
        {
          name: 'reopened_as_warranty',
          definition: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false
          }
        }
      ];

      // Add missing columns one by one
      for (const column of columns) {
        if (!tableDescription[column.name]) {
          console.log(`Adding missing column: ${column.name}`);
          try {
            await queryInterface.addColumn('work_orders', column.name, column.definition);
          } catch (error) {
            console.log(`Error adding column ${column.name}:`, error.message);
            // Continue with other columns even if one fails
          }
        }
      }

      // Add createdAt and updatedAt if missing
      if (!tableDescription['createdAt']) {
        console.log('Adding createdAt column');
        try {
          await queryInterface.addColumn('work_orders', 'createdAt', {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          });
        } catch (error) {
          console.log('Error adding createdAt column:', error.message);
        }
      }

      if (!tableDescription['updatedAt']) {
        console.log('Adding updatedAt column');
        try {
          await queryInterface.addColumn('work_orders', 'updatedAt', {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
          });
        } catch (error) {
          console.log('Error adding updatedAt column:', error.message);
        }
      }

      // Handle status enum separately (special case)
      if (!tableDescription['status']) {
        console.log('Adding status column with ENUM');
        try {
          await queryInterface.addColumn('work_orders', 'status', {
            type: Sequelize.ENUM('REQUESTED', 'DIAGNOSED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REWORK', 'WARRANTY'),
            allowNull: true,
            defaultValue: 'REQUESTED'
          });
        } catch (error) {
          console.log('Error adding status column:', error.message);
        }
      }

      // Add missing indexes (check if they exist first)
      try {
        const indexes = await queryInterface.showIndex('work_orders');
        const existingIndexes = indexes.map(index => index.fields.map(field => field.attribute).join(','));
        
        const indexesToAdd = [
          { fields: ['client_id'], name: 'work_orders_client_id' },
          { fields: ['location_id'], name: 'work_orders_location_id' },
          { fields: ['status'], name: 'work_orders_status' },
          { fields: ['priority'], name: 'work_orders_priority' },
          { fields: ['requested_by'], name: 'work_orders_requested_by' },
          { fields: ['assigned_technician'], name: 'work_orders_assigned_technician' },
          { fields: ['work_order_code'], name: 'work_orders_work_order_code' }
        ];

        for (const index of indexesToAdd) {
          const fieldString = index.fields.join(',');
          if (!existingIndexes.includes(fieldString)) {
            console.log(`Adding missing index: ${index.name}`);
            try {
              await queryInterface.addIndex('work_orders', index.fields, {
                name: index.name
              });
            } catch (error) {
              console.log(`Index ${index.name} might already exist:`, error.message);
            }
          }
        }
      } catch (error) {
        console.log('Error handling indexes:', error.message);
      }

      // Update existing NULL values for required fields
      try {
        console.log('Updating NULL values for required fields...');
        
        // Update NULL client_id values
        await queryInterface.sequelize.query(
          "UPDATE work_orders SET client_id = 0 WHERE client_id IS NULL"
        );
        
        // Update NULL location_id values
        await queryInterface.sequelize.query(
          "UPDATE work_orders SET location_id = 0 WHERE location_id IS NULL"
        );
        
        // Update NULL requested_by values
        await queryInterface.sequelize.query(
          "UPDATE work_orders SET requested_by = 0 WHERE requested_by IS NULL"
        );
        
        // Update NULL contact_person values
        await queryInterface.sequelize.query(
          "UPDATE work_orders SET contact_person = '' WHERE contact_person IS NULL"
        );
        
        // Update NULL contact_number values
        await queryInterface.sequelize.query(
          "UPDATE work_orders SET contact_number = '' WHERE contact_number IS NULL"
        );
        
        console.log('NULL values updated successfully');
      } catch (error) {
        console.log('Error updating NULL values:', error.message);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // Only drop table if you want to completely remove it
    // Be very careful with this in production
    await queryInterface.dropTable('work_orders');
  }
};