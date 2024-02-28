const express = require('express'); // Imports the Express module
const router = express.Router(); // Creates an instance of the Express router

const purchaseController = require('../contoller/purchase'); // Imports the purchase controller module
const Authentication = require('../middleware/auth'); // Imports the authentication middleware

// Defines a route for purchasing premium membership, requiring authentication
router.get('/premiumMemberShip', Authentication.Authenticate, purchaseController.purchasePremium);

// Defines a route for updating transaction status, requiring authentication
router.post('/updateTransactionStatus', Authentication.Authenticate, purchaseController.updateTransactionStatus);

module.exports = router; // Exports the configured router for use in other parts of the application



// Express Import and Router Initialization: It imports the Express module and initializes an instance of the Express router to define routes separately.

// Purchase Controller and Authentication Middleware Import: It imports the purchase controller module (purchaseController) and the authentication middleware (Authentication) from their respective files or modules.

// Route Definitions: It defines two routes using the initialized router.

// router.get('/premiumMemberShip', Authentication.Authenticate, purchaseController.purchasePremium);: Defines a GET route '/premiumMemberShip' that triggers the purchasePremium controller function from the purchase controller module. It uses the Authentication.Authenticate middleware to ensure that only authenticated users can purchase premium membership.

// router.post('/updateTransactionStatus', Authentication.Authenticate, purchaseController.updateTransactionStatus);: Defines a POST route '/updateTransactionStatus' that triggers the updateTransactionStatus controller function from the purchase controller module. It also uses the Authentication.Authenticate middleware to authenticate users before allowing the transaction status update.

// Exporting Router: It exports the configured router (router) so that it can be used in other parts of the application, typically by attaching it to the main Express app or mounting it on specific paths.