// The following code was commented out, likely due to possible refactoring or temporary changes.

// Required modules and configurations for payment processing using Razorpay
// Some debugging logs and functions seem to have been commented out or removed during this phase.
// It includes the purchase of premium membership and updating transaction status.

const Order = require('../models/orders');
const Razorpay = require('razorpay');
const User = require('../models/users'); // Corrected model import
require('dotenv').config();

// Purchase premium membership by generating an order using Razorpay
exports.purchasePremium = async (req, res) => {
    try {
        // Initialize Razorpay with API keys
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const amount = 2500; // Set the membership amount
        // Create an order with the specified amount and currency
        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            try {
                // Create a new order associated with the user
                await req.user.createOrder({ orderid: order.id, status: 'PENDING' });
                return res.status(201).json({ order, key_id: rzp.key_id, amount: amount });
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Update the transaction status after payment confirmation
exports.updateTransactionStatus = async (req, res) => {
    try {
        const userId = req.user;
        const { payment_id, order_id } = req.body;

        // Find the order by order_id
        const order = await Order.findOne({ where: { orderid: order_id } });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Update the order with the payment_id and set status to SUCCESSFUL
        await order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });

        // Update the user's status to premium
        await User.update({ ispremiumuser: true }, { where: { id: userId } });

        return res.status(202).json({ success: true, message: "Transaction Successful" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
