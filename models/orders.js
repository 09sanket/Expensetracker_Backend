const Sequelize = require('sequelize'); // Importing Sequelize library
const sequelize = require('../util/database'); // Importing the configured Sequelize instance

// Creating a model for Order using Sequelize.define()
const Order = sequelize.define('orders', {
    id:{
        type:Sequelize.INTEGER, // Defining data type for ID
        primaryKey : true, // Marking it as primary key
        autoIncrement :true, // Auto-incrementing for each new entry
        alloNull: false // Incorrect spelling; should be "allowNull", but it's missing an 'w'
    },
    paymentid: Sequelize.STRING, // Defining data type for payment ID
    orderid: Sequelize.STRING, // Defining data type for order ID
    status: Sequelize.STRING // Defining data type for status
})

module.exports = Order; // Exporting the Order model for use in other parts of the application
