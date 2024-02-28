const expense = require('express'); // Requires the Express module
const router = expense.Router(); // Initializes an instance of the Express router
const expenseContoller = require('../contoller/expenses'); // Imports the expense controller
const Authentication = require('../middleware/auth'); // Imports the authentication middleware

// Define different routes and link them to respective controller functions and middleware
router.post("/add-expenses", Authentication.Authenticate, expenseContoller.addExpense); // POST request to add an expense
router.get("/get-expenses", Authentication.Authenticate, expenseContoller.getExpense); // GET request to fetch expenses
router.delete('/delete-expense/:id', Authentication.Authenticate, expenseContoller.deleteExpense); // DELETE request to delete an expense

module.exports = router; // Export the configured router for use in other parts of the application



// express Import: It requires the Express module, making it available for use in this file.
// Router Initialization: It initializes an instance of the Express router using express.Router(), which allows for defining routes separately and later exporting them as a single entity.
// Controller and Middleware Import: It imports the expense controller (expenseContoller) and authentication middleware (Authentication) from their respective files or modules.
// Route Definitions: It defines different routes using the initialized router and links each route to its respective controller function (addExpense, getExpense, deleteExpense) from the expense controller. Additionally, it uses the Authentication.Authenticate middleware to authenticate users for these routes.
// router.post(): Defines a POST route '/add-expenses' that triggers the addExpense controller function.
// router.get(): Defines a GET route '/get-expenses' that triggers the getExpense controller function.
// router.delete(): Defines a DELETE route '/delete-expense/:id' that triggers the deleteExpense controller function.
// Exporting Router: It exports the configured router (router) so that it can be used in other parts of the application, typically by attaching it to the main Express app or mounting it on specific paths.

// --------------------------------------------------------------------------------------------------------------------- 