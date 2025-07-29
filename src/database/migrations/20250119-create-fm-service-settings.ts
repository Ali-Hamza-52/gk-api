import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('fm_service_settings', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    task_name: {
      type: DataTypes.STRING(255),
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
        'Civil',
      ),
      allowNull: false,
    },
    default_duration_hrs: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    default_material_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    custom_pricing: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    priority: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    sla: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    building_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    notes: {
      type: DataTypes.TEXT,
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
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('fm_service_settings');
};
