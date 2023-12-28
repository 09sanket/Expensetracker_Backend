const Users = require('../models/users');
const Expenses = require("../models/expenses");
const sequelize = require('../util/database');

// Endpoint to retrieve leaderboard data based on user expenses
exports.getLeaderBoard = async (req, res) => {
    try {
        // Fetch users' data including id, name, and totalExpense attributes
        // Order the results based on the totalExpense in descending order (highest to lowest)
        const leaderboardData = await Users.findAll({
            attributes: ['id', 'name', 'totalExpense'],
            order: [['totalExpense', 'DESC']]
        });

        // Send the fetched leaderboard data as a JSON response
        res.status(200).json(leaderboardData);
    } catch (err) {
        // Handle any errors that might occur during the process
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
