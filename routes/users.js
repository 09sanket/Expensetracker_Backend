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
