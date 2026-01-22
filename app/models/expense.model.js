const { types } = require("pg");

module.exports = (sequelize, Sequelize) => {
  const Expense = sequelize.define("expense", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    category: {
      type: Sequelize.STRING
    },
      amount: {
      type: Sequelize.DECIMAL(10, 2),
    },
      description: {
      type: Sequelize.STRING
    },
     date: {
     type: Sequelize.DATE
  }

  });
  return Expense;
};
