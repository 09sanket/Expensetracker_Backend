const express = require('express'); // Importing Express framework
const router = express.Router(); // Creating an instance of Express router

const usersContoller = require('../contoller/users'); // Importing user controller
const expenseController = require('../contoller/expenses'); // Importing expense controller
const Authentication = require('../middleware/auth'); // Importing authentication middleware

router.post('/signUp', usersContoller.signUp); // Route to handle user sign up
router.post("/login", usersContoller.login); // Route to handle user login
router.get('/get-user', Authentication.Authenticate, usersContoller.isPremium); // Route to fetch user details, requires authentication
router.get('/download', Authentication.Authenticate, expenseController.download); // Route to download expenses, requires authentication

module.exports = router; // Exporting the configured router


// Express Import and Router Initialization: Imports the Express module and initializes an instance of the Express router to define routes separately.

// Controller and Authentication Middleware Import: Imports the user controller (usersContoller), expense controller (expenseController), and authentication middleware (Authentication) from their respective files or modules.

// Route Definitions: It defines four routes using the initialized router.

// router.post('/signUp', usersContoller.signUp);: Defines a POST route '/signUp' that triggers the signUp controller function from the user controller module. This route handles user sign-up.

// router.post("/login", usersContoller.login);: Defines a POST route "/login" that triggers the login controller function from the user controller module. This route handles user login.

// router.get('/get-user', Authentication.Authenticate, usersContoller.isPremium);: Defines a GET route '/get-user' that triggers the isPremium controller function from the user controller module. It requires authentication using the Authentication.Authenticate middleware to fetch user details.

// router.get('/download', Authentication.Authenticate, expenseController.download);: Defines a GET route '/download' that triggers the download controller function from the expense controller module. It requires authentication using the Authentication.Authenticate middleware to download expenses.

// Exporting Router: It exports the configured router (router) so that it can be used in other parts of the application, typically by attaching it to the main Express app or mounting it on specific paths.