const expense = require('express'); // Requires the Express module
const router = expense.Router(); // Initializes an instance of the Express router
const expenseContoller = require('../contoller/expenses'); // Imports the expense controller
const Authentication = require('../middleware/auth'); // Imports the authentication middleware

// Define different routes and link them to respective controller functions and middleware
router.post("/add-expenses", Authentication.Authenticate, expenseContoller.addExpense); // POST request to add an expense
router.get("/get-expenses", Authentication.Authenticate, expenseContoller.getExpense); // GET request to fetch expenses
router.delete('/delete-expense/:id', Authentication.Authenticate, expenseContoller.deleteExpense); // DELETE request to delete an expense

module.exports = router; // Export the configured router for use in other parts of the application
