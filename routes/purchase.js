const express = require('express'); // Imports the Express module
const router = express.Router(); // Creates an instance of the Express router

const purchaseController = require('../contoller/purchase'); // Imports the purchase controller module
const Authentication = require('../middleware/auth'); // Imports the authentication middleware

// Defines a route for purchasing premium membership, requiring authentication
router.get('/premiumMemberShip', Authentication.Authenticate, purchaseController.purchasePremium);

// Defines a route for updating transaction status, requiring authentication
router.post('/updateTransactionStatus', Authentication.Authenticate, purchaseController.updateTransactionStatus);

module.exports = router; // Exports the configured router for use in other parts of the application
