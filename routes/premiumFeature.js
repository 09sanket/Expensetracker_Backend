const expense = require('express'); // Imports the Express module
const router = expense.Router(); // Creates an instance of the Express router

const premiumFeatureContoller = require('../contoller/premiumFeature'); // Imports the premium feature controller module
const Authentication = require('../middleware/auth'); // Imports the authentication middleware

// Defines a route that requires authentication to access the leaderboard feature
router.get('/showloaderBoard', Authentication.Authenticate, premiumFeatureContoller.getLeaderBoard);

module.exports = router; // Exports the configured router for use in other parts of the application
