import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('client_base', {
    client_code: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    client_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    client_name_ar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address_ar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cr_no: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cr: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vat_no: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    vat_cert: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ajeer_license: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dept_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dept_ar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contract: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contract_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contract_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fat_details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rate1: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    rate2: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    overtime_rate1: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    overtime_rate2: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    daysWeek: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hoursDay: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    account_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    iban: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sales_person: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    StreetName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    BuildingNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    District: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    CityName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PostalZone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billing_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billing_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billing_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hr_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hr_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hr_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('client_base');
}
