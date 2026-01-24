const db = require("../models");
const Expense = db.expense;
const Op = db.Sequelize.Op;

// Define allowed categories
const allowedCategories = ['Alimentation', 'Transport', 'Logement', 'Loisirs', 'Santé', 'Education',"autres"];

// Create and Save a new expense
exports.create = (req, res) => {
  console.log('Expense creation attempt:', { category: req.body.category, amount: req.body.amount, date: req.body.date });
  // Validate request
  if (!req.body) {
    console.error('[ERROR] Empty request body for expense creation', {
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
    console.log('Validation failed: missing required fields');
    return res.status(400).json({
      message: 'Category, amount and date are required'
    });
  }

  // Category validation
  if (!allowedCategories.includes(category)) {
    console.log('Validation failed: invalid category', category);
    return res.status(400).json({
      message: 'Invalid category'
    });
  }

  // Amount validation //typeof amount !== 'number' ||
  if ( amount <= 0) {
    console.log('Validation failed: invalid amount', amount);
    return res.status(400).json({
      message: 'Amount must be a positive number'
    });
  }

  // Date validation
  if (isNaN(Date.parse(date))) {
    console.log('Validation failed: invalid date', date);
    return res.status(400).json({
      message: 'Invalid date format'
    });
  }

  // Description validation (optional)
  if (description && description.length > 255) {
    console.log('Validation failed: description too long');
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

  console.log('Creating expense:', expense);
  // Save an expense in the database
  Expense.create(expense)
    .then(data => {
      console.log('Expense created successfully with ID:', data.id);
      res.send(data);
    })
    .catch(err => {
      console.error('Error creating expense:', err.message);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the expense."
      });
    });
};

// Retrieve all expenses from the database.
exports.findAll = (req, res) => {
  const category = req.query.category;
  console.log('Fetching expenses, category filter:', category);
  var condition = category ? { category: { [Op.iLike]: `%${category}%` } } : null;

  Expense.findAll({ where: condition })
    .then(data => {
      console.log('Expenses retrieved:', data.length, 'records');
      res.send(data);
    })
    .catch(err => {
      console.error('Error retrieving expenses:', err.message);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving expenses."
      });
    });
};

// Find a single expense with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  console.log('Fetching expense with ID:', id);

  Expense.findByPk(id)
    .then(data => {
      if (data) {
        console.log('Expense found');
        res.send(data);
      } else {
        console.log('Expense not found');
        res.status(404).send({
          message: `Cannot find expense with id=${id}.`
        });
      }
    })
    .catch(err => {
      console.error('Error retrieving expense:', err.message);
      res.status(500).send({
        message: "Error retrieving expense with id=" + id
      });
    });
};

// Update an expense by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  console.log('Updating expense with ID:', id);

  // Validate request
  if (!req.body) {
    console.error('[ERROR] Empty request body for expense update');
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const { category, amount, description, date } = req.body;

  // Required fields
  if (!category || !amount || !date) {
    console.log('Validation failed: missing required fields for update');
    return res.status(400).json({
      message: 'Category, amount and date are required'
    });
  }

  // Category validation
  if (!allowedCategories.includes(category)) {
    console.log('Validation failed: invalid category for update', category);
    return res.status(400).json({
      message: 'Invalid category'
    });
  }

  // Amount validation //typeof amount !== 'number' ||
  if ( amount <= 0) {
    console.log('Validation failed: invalid amount for update', amount);
    return res.status(400).json({
      message: 'Amount must be a positive number'
    });
  }

  // Date validation
  if (isNaN(Date.parse(date))) {
    console.log('Validation failed: invalid date for update', date);
    return res.status(400).json({
      message: 'Invalid date format'
    });
  }

  // Description validation (optional)
  if (description && description.length > 255) {
    console.log('Validation failed: description too long for update');
    return res.status(400).json({
      message: 'Description must be less than 255 characters'
    });
  }

  // Update expense
  Expense.update({
    category,
    amount,
    description,
    date
  }, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        console.log('Expense updated successfully');
        res.send({
          message: "Expense was updated successfully."
        });
      } else {
        console.log('Expense not found for update');
        res.send({
          message: `Cannot update expense with id=${id}. Maybe expense was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      console.error('Error updating expense:', err.message);
      res.status(500).send({
        message: "Error updating expense with id=" + id
      });
    });
};

// Delete an expense with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  console.log('Deleting expense with ID:', id);

  Expense.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        console.log('Expense deleted successfully');
        res.send({
          message: "Expense was deleted successfully!"
        });
      } else {
        console.log('Expense not found for deletion');
        res.send({
          message: `Cannot delete expense with id=${id}. Maybe expense was not found!`
        });
      }
    })
    .catch(err => {
      console.error('Error deleting expense:', err.message);
      res.status(500).send({
        message: "Could not delete expense with id=" + id
      });
    });
};

