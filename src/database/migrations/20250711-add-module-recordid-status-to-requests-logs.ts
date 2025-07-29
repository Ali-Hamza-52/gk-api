'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('requests_logs', 'module', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('requests_logs', 'record_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
    });

    await queryInterface.addColumn('requests_logs', 'status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('requests_logs', 'module');
    await queryInterface.removeColumn('requests_logs', 'record_id');
    await queryInterface.removeColumn('requests_logs', 'status');
  },
};
