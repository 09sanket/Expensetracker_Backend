const Sequelize = require('sequelize'); // Importing Sequelize ORM
const seqelize = require("../util/database"); // Importing the configured Sequelize instance

// Creating a model for Expenses using Sequelize.define()
const Expenses = seqelize.define('expenses', {
    id: {
        type: Sequelize.INTEGER, // Define the data type for the ID
        autoIncrement: true, // Auto-incrementing for each new entry
        allowNull: false, // ID cannot be null
        primaryKey: true // Marking it as a primary key
    },
    amount:{
        type:Sequelize.FLOAT // Define the data type for the amount
    },
    description:{
        type: Sequelize.STRING, // Define the data type for the description
        allowNull: false, // Description cannot be null
    },
    category:{
        type: Sequelize.STRING, // Define the data type for the category
        allowNull:false // Category cannot be null
    }
})

module.exports = Expenses; // Exporting the Expenses model
