const expense = require('express'); // Imports the Express module
const router = expense.Router(); // Creates an instance of the Express router

const premiumFeatureContoller = require('../contoller/premiumFeature'); // Imports the premium feature controller module
const Authentication = require('../middleware/auth'); // Imports the authentication middleware

// Defines a route that requires authentication to access the leaderboard feature
router.get('/showloaderBoard', Authentication.Authenticate, premiumFeatureContoller.getLeaderBoard);

module.exports = router; // Exports the configured router for use in other parts of the application


// Express Import and Router Initialization: It imports the Express module and initializes an instance of the Express router to define routes separately.
// Premium Feature Controller and Authentication Middleware Import: It imports the premium feature controller module (premiumFeatureContoller) and the authentication middleware (Authentication) from their respective files or modules.
// Route Definition: It defines a single route using the initialized router.
// router.get('/showloaderBoard', Authentication.Authenticate, premiumFeatureContoller.getLeaderBoard);: Defines a GET route '/showloaderBoard' that triggers the getLeaderBoard controller function from the premium feature controller module. It uses the Authentication.Authenticate middleware to ensure that only authenticated users can access the leaderboard feature.
// Exporting Router: It exports the configured router (router) so that it can be used in other parts of the application, typically by attaching it to the main Express app or mounting it on specific paths.