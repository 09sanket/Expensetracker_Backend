const expense = require('express'); // Requires the Express module
const router = expense.Router(); // Initializes an instance of the Express router

const passwordController = require('../contoller/password'); // Imports the password controller module

// Define different routes and link them to respective controller functions
router.get('/resetpassword/:id', passwordController.resetPassword); // GET request to reset password
router.get('/updatepassword/:id', passwordController.updatePassword); // GET request to update password
router.post('/forget-password', passwordController.forgetPassword); // POST request to handle forget password

module.exports = router; // Export the configured router for use in other parts of the application
