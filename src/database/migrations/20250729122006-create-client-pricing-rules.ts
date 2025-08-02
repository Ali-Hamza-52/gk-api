// migrations/YYYYMMDDHHMMSS-create-client-pricing-rules-table.ts

import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    // Check if table exists
    const tableExists = await queryInterface.tableExists('client_pricing_rules');
    
    if (!tableExists) {
      // Create the table if it doesn't exist
      await queryInterface.createTable('client_pricing_rules', {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        client_code: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: 'Foreign key reference to client table',
        },
        category: {
          type: DataTypes.ENUM(
            'HVAC',
            'Plumbing', 
            'Electrical',
            'Electronics',
            'Cleaning',
            'Pest Control',
            'Landscaping',
            'Civil'
          ),
          allowNull: false,
          comment: 'Service category',
        },
        pricing_type: {
          type: DataTypes.ENUM('discount', 'markup'),
          allowNull: false,
          comment: 'Type of pricing adjustment',
        },
        percentage_value: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          comment: 'Percentage value for adjustment (0-100)',
        },
        applies_to: {
          type: DataTypes.JSON,
          allowNull: false,
          comment: 'Array of what the pricing rule applies to (service, addon, material)',
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: true,
          comment: 'User ID who created the record',
        },
        updated_by: {
          type: DataTypes.INTEGER,
          allowNull: true,
          comment: 'User ID who last updated the record',
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

      // Add index on client_code for better query performance
      await queryInterface.addIndex('client_pricing_rules', ['client_code'], {
        name: 'idx_client_pricing_rules_client_code',
      });

      // Add index on category for filtering
      await queryInterface.addIndex('client_pricing_rules', ['category'], {
        name: 'idx_client_pricing_rules_category',
      });

      // Add index on pricing_type for summary queries
      await queryInterface.addIndex('client_pricing_rules', ['pricing_type'], {
        name: 'idx_client_pricing_rules_pricing_type',
      });

      // Add composite index for common filter combinations
      await queryInterface.addIndex('client_pricing_rules', ['client_code', 'category'], {
        name: 'idx_client_pricing_rules_client_category',
      });

      console.log('✅ Created client_pricing_rules table with indexes');
    } else {
      console.log('⚠️  Table client_pricing_rules already exists, checking for missing columns...');
      
      // Get table description to check existing columns
      const tableDescription = await queryInterface.describeTable('client_pricing_rules');
      
      // Define required columns with their specifications
      const requiredColumns = {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        client_code: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        category: {
          type: DataTypes.ENUM(
            'HVAC',
            'Plumbing',
            'Electrical', 
            'Electronics',
            'Cleaning',
            'Pest Control',
            'Landscaping',
            'Civil'
          ),
          allowNull: false,
        },
        pricing_type: {
          type: DataTypes.ENUM('discount', 'markup'),
          allowNull: false,
        },
        percentage_value: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
        },
        applies_to: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        updated_by: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      };

      // Check and add missing columns
      for (const [columnName, columnSpec] of Object.entries(requiredColumns)) {
        if (!tableDescription[columnName]) {
          console.log(`➕ Adding missing column: ${columnName}`);
          await queryInterface.addColumn('client_pricing_rules', columnName, columnSpec);
        }
      }

      // Check and add missing indexes
      const indexes = await queryInterface.showIndex('client_pricing_rules');
      const existingIndexNames = Array.isArray(indexes) 
        ? indexes.map((idx: any) => idx.name)
        : [];

      const requiredIndexes = [
        {
          name: 'idx_client_pricing_rules_client_code',
          fields: ['client_code'],
        },
        {
          name: 'idx_client_pricing_rules_category', 
          fields: ['category'],
        },
        {
          name: 'idx_client_pricing_rules_pricing_type',
          fields: ['pricing_type'],
        },
        {
          name: 'idx_client_pricing_rules_client_category',
          fields: ['client_code', 'category'],
        },
      ];

      for (const index of requiredIndexes) {
        if (!existingIndexNames.includes(index.name)) {
          console.log(`➕ Adding missing index: ${index.name}`);
          await queryInterface.addIndex('client_pricing_rules', index.fields, {
            name: index.name,
          });
        }
      }
    }

    console.log('✅ Client pricing rules table migration completed successfully');
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    // Drop indexes first
    const indexes = [
      'idx_client_pricing_rules_client_code',
      'idx_client_pricing_rules_category',
      'idx_client_pricing_rules_pricing_type', 
      'idx_client_pricing_rules_client_category',
    ];

    for (const indexName of indexes) {
      try {
        await queryInterface.removeIndex('client_pricing_rules', indexName);
        console.log(`🗑️  Dropped index: ${indexName}`);
      } catch (error) {
        console.log(`⚠️  Index ${indexName} may not exist, skipping...`);
      }
    }

    // Drop the table
    await queryInterface.dropTable('client_pricing_rules');
    console.log('🗑️  Dropped client_pricing_rules table');
  },
};
