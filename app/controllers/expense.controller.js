const db = require("../models");
const Expense = db.expense;
const Op = db.Sequelize.Op;

// Create and Save a new expense
exports.create = (req, res) => {
  // Validate request
if (!req.body) {
  console.error('[ERROR] Empty request body', {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    time: new Date().toISOString()
  });

  return res.status(400).send({
    message: "Content can not be empty!"
  });
}



  const { category, amount, description, date } = req.body;

// Required fields
if (!category || !amount || !date) {
  return res.status(400).json({
    message: 'Category, amount and date are required'
  });
}

// Category validation
if (!allowedCategories.includes(category)) {
  return res.status(400).json({
    message: 'Invalid category'
  });
}

// Amount validation
if (typeof amount !== 'number' || amount <= 0) {
  return res.status(400).json({
    message: 'Amount must be a positive number'
  });
}

// Date validation
if (isNaN(Date.parse(date))) {
  return res.status(400).json({
    message: 'Invalid date format'
  });
}

// Description validation (optional)
if (description && description.length > 255) {
  return res.status(400).json({
    message: 'Description must be less than 255 characters'
  });
}


  
   // If everything is valid
 const expense = {
  category,
  amount,
  description,
  date
  };

  // Save an expense in the database
  Expense.create(expense)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the expense."
      });
    });
  
    // Retrieve all expenses from the database.
exports.findAll = (req, res) => {
  const category = req.query.category;
  var condition = category ? { category: { [Op.iLike]: `%${category}%` } } : null;

    }

Expense.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving expenses."
      });
    });

};


