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

// Code Explanation:
// Imports and Database Connection:

// Imports necessary models (Users and Expenses) and the Sequelize instance from the respective files (../models/users, ../models/expenses, ../util/database).
// getLeaderBoard Function:

// An asynchronous function handling the leaderboard retrieval logic.
// Uses a try-catch block to handle potential errors.
// Fetching Leaderboard Data:

// Uses Sequelize's Users.findAll() method to query the database for user data.
// Specifies attributes to retrieve (id, name, totalExpense) for each user.
// Orders the results based on totalExpense in descending order (DESC), meaning the users with the highest expenses will appear first in the leaderboard.
// Response Handling:

// If successful, responds with a status code of 200 and sends the fetched leaderboard data as a JSON response.
// If an error occurs during the process, logs the error and sends a status code of 500 with a JSON response indicating an internal server error.
// Potential Improvement:
// It might be beneficial to paginate the leaderboard data if the number of users is significant to avoid sending too much data in a single response.

// Questions to Consider:
// Data Consistency: How frequently is this leaderboard updated based on user expenses?
// Performance: Have you considered optimizing the query for better performance when dealing with a large number of users?
// Endpoint Security: Is this endpoint protected from unauthorized access? Are there any access control measures in place?