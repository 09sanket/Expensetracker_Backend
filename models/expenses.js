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



// const Sequelize = require('sequelize');: Imports the Sequelize library, an ORM for Node.js that simplifies database operations.

// const seqelize = require("../util/database");: Imports the configured Sequelize instance from the 'database.js' file in the 'util' folder. This instance is previously configured with database connection details.

// const Expenses = seqelize.define('expenses', { ... });: Creates a Sequelize model named 'Expenses' using the define() method. This model represents the 'expenses' table in the database.

// id: { ... }: Defines the 'id' field in the 'expenses' table with specifications such as data type (INTEGER), auto-increment, not allowing null values, and marking it as the primary key.

// amount: { type: Sequelize.FLOAT }: Defines the 'amount' field with the data type FLOAT.

// description: { ... }: Defines the 'description' field with specifications such as data type (STRING) and disallowing null values.

// category: { ... }: Defines the 'category' field with specifications such as data type (STRING) and disallowing null values.

// module.exports = Expenses;: Exports the 'Expenses' model, making it available to 
