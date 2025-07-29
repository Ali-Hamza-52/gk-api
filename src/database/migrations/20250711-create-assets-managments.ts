'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assets_managments', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      asset_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      serial: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      asset_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      asset_make_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      asset_capacity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      asset_model: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fuel_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      purchase_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      purchase_price_excl_vat: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      warranty_expiry_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      useful_life: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      usages: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      warranty_documents: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      invoice_documents: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      front_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      back_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      right_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      left_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      current_location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      odo_meter_reading: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      category: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      lat: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      lng: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('assets_managments');
  },
};
