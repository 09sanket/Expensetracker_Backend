const expense = require('express'); // Requires the Express module
const router = expense.Router(); // Initializes an instance of the Express router

const passwordController = require('../contoller/password'); // Imports the password controller module

// Define different routes and link them to respective controller functions
router.get('/resetpassword/:id', passwordController.resetPassword); // GET request to reset password
router.get('/updatepassword/:id', passwordController.updatePassword); // GET request to update password
router.post('/forget-password', passwordController.forgetPassword); // POST request to handle forget password

module.exports = router; // Export the configured router for use in other parts of the application



// Express Import and Router Initialization: It requires the Express module and initializes an instance of the Express router to define routes separately and export them as a single entity.
// Password Controller Import: It imports the password controller module from the specified path ('../contoller/password'). This module likely contains functions related to handling passwod-related operations.
// Route Definitions: It defines different routes using the initialized router and links each route to its respective controller function from the password controller module.
// router.get('/resetpassword/:id', passwordController.resetPassword);: Defines a GET route '/resetpassword/:id' that triggers the resetPassword controller function. This route might be used to initiate a password reset process for a specific user.
// router.get('/updatepassword/:id', passwordController.updatePassword);: Defines a GET route '/updatepassword/:id' that triggers the updatePassword controller function. This route might handle updating a user's password.
// router.post('/forget-password', passwordController.forgetPassword);: Defines a POST route '/forget-password' that triggers the forgetPassword controller function. This route might handle the process of handling forgotten passwords.
// Exporting Router: It exports the configured router (router) so that it can be used in other parts of the application, typically by attaching it to the main Express app or mounting it on specific paths.