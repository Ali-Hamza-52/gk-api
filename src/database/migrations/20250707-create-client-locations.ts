import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('client_locations', {
    client_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'client_base',
        key: 'client_code',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    location_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location_name_ar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location_map: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('client_locations');
}
