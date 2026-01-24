const { verifySignUp } = require("../middleware");
const expense = require("../controllers/expense.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Create a new expense
  app.post("/api/expenses/create", expense.create);

  // Retrieve all expenses
  app.get("/api/expenses/all", expense.findAll);

  // Retrieve a single expense with id
  app.get("/api/expenses/:id", expense.findOne);

  // Update an expense with id
  app.put("/api/expenses/:id", expense.update);

  // Delete an expense with id
  app.delete("/api/expenses/:id", expense.delete);
};
