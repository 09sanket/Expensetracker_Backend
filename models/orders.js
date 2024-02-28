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



// const Sequelize = require('sequelize');: Imports the Sequelize library, an ORM (Object-Relational Mapping) for Node.js that simplifies interactions with databases.

// const sequelize = require('../util/database');: Imports the configured Sequelize instance from the 'database.js' file in the 'util' folder. This instance holds the connection details to the database.

// const Order = sequelize.define('orders', { ... });: Defines a Sequelize model named 'Order' using the define() method. This model represents the 'orders' table in the database.

// id: { ... }: Defines the 'id' field in the 'orders' table with specifications such as data type (INTEGER), primary key, auto-incrementing for new entries, and it tries to specify 'alloNull' (a misspelling of 'allowNull') as false, though the misspelling means this constraint won't be applied correctly.

// paymentid: Sequelize.STRING: Defines the 'paymentid' field with the data type STRING.

// orderid: Sequelize.STRING: Defines the 'orderid' field with the data type STRING.

// status: Sequelize.STRING: Defines the 'status' field with the data type STRING.

// module.exports = Order;: Exports the 'Order' model, making it available for use in other parts of the application that require interaction with the 'orders' table in the database.