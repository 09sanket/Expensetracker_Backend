
const Order = require('../models/orders');
const Razorpay = require('razorpay');
const User = require('../models/users'); // Corrected model import
require('dotenv').config(); // Import dotenv for environment variables

// Purchase premium membership by generating an order using Razorpay
exports.purchasePremium = async (req, res) => {
    try {
        // Initialize Razorpay with API keys
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID, // Fetch API Key ID from environment variables
            key_secret: process.env.RAZORPAY_KEY_SECRET, // Fetch API Key Secret from environment variables
        });

        const amount = 2500; // Set the membership amount
        // Create an order with the specified amount and currency
        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                return res.status(500).json({ error: err.message }); // Error handling for order creation failure
            }
            try {
                // Create a new order associated with the logged-in user
                await req.user.createOrder({ orderid: order.id, status: 'PENDING' });
                return res.status(201).json({ order, key_id: rzp.key_id, amount: amount });
                // Return the created order details and Razorpay key ID
            } catch (error) {
                return res.status(500).json({ error: error.message }); // Error handling for order association failure
            }
        });
    } catch (err) {
        return res.status(500).json({ error: err.message }); // Generic error handling
    }
};

// Explanation:

// Razorpay Initialization:

// The code initializes the Razorpay SDK by creating a new instance of Razorpay and providing API keys fetched from environment variables using process.env.
// Order Creation:

// It uses Razorpay's orders.create method to create an order with a specified amount (amount = 2500) and currency ("INR").
// Order Association:

// Upon successful order creation, it attempts to associate the newly created order with the logged-in user (req.user) by using createOrder (assuming the User model has an association method).
// Response Handling:

// If any errors occur during the process, it returns appropriate error messages with corresponding HTTP status codes (500 for internal server error, 201 for successful creation).





// Update the transaction status after payment confirmation
exports.updateTransactionStatus = async (req, res) => {
    try {
        const userId = req.user; // Fetch the user ID from the request
        const { payment_id, order_id } = req.body; // Extract payment and order IDs from the request body

        // Find the order by order_id
        const order = await Order.findOne({ where: { orderid: order_id } });
        if (!order) {
            return res.status(404).json({ message: "Order not found" }); // If order not found, return 404 error
        }

        // Update the order with the payment_id and set status to SUCCESSFUL
        await order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });

        // Update the user's status to premium by setting ispremiumuser to true
        await User.update({ ispremiumuser: true }, { where: { id: userId } });

        return res.status(202).json({ success: true, message: "Transaction Successful" }); // Return success message
    } catch (err) {
        return res.status(500).json({ error: err.message }); // If any error occurs, return 500 error with error message
    }
};

// User ID and Request Body:

// userId is extracted from req.user, presuming it holds the ID of the logged-in user.
// payment_id and order_id are extracted from the request body.

// Order Update:

// Searches for an order in the database based on the provided order_id.
// If the order is not found, it returns a 404 status with an appropriate message.
// If the order is found, it updates the order's paymentid and sets its status to 'SUCCESSFUL'.'

// User Premium Status Update:

// Updates the user's data in the User model, setting the ispremiumuser field to true for the user with the specified userId.

// Response Handling:

// If the updates are successful, it returns a 202 status (Accepted) with a success message.
// If any error occurs during the process, it catches the error and returns a 500 status (Internal Server Error) along with the error message.