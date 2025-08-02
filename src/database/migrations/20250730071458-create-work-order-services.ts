'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('work_order_services', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      work_order_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'work_orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      service_id_link: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'fm_service_settings',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      task_status: {
        type: Sequelize.ENUM(
          'Requested',
          'Diagnosed',
          'Rejected',
          'In-Progress',
          'Completed',
          'Rework',
          'Warranty'
        ),
        allowNull: false,
        defaultValue: 'Requested',
      },
      approved_by_client: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      approved_by_userid: {
        type: Sequelize.BIGINT.UNSIGNED, // Changed from BIGINT to INTEGER to match users.id
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
      },
      approved_date: {
        type: Sequelize.DATE,
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
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('work_order_services');
  },
};