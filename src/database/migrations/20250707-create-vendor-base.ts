import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('vendor_base', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name_ar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cr_no: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cr_file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vat_no: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    vat_file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contract: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_ops: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_ops_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_billing: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_billing_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_gov: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_gov_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('vendor_base');
}
