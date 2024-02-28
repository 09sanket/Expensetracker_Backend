const Sequelize = require('sequelize'); // Importing Sequelize library
const sequelize = require('../util/database'); // Importing the configured Sequelize instance

// Defining the 'Users' model using Sequelize.define()
const Users = sequelize.define('users',{
    id: {
        type: Sequelize.INTEGER, // Defining data type for 'id' as INTEGER
        autoIncrement: true, // Allowing it to auto-increment
        allowNull: false, // Ensuring it cannot be null
        primaryKey: true // Marking it as primary key
    },
    name:{
        type:Sequelize.STRING // Defining data type for 'name' as STRING
    },
    email:{
        type: Sequelize.STRING, // Defining data type for 'email' as STRING
        allowNull: false, // Ensuring it cannot be null
        unique: { // Making it unique in the database
            args: true, // Defining uniqueness arguments
            msg: 'Email address already in use!' // Custom error message for duplicate emails
        }
    },
    password:{
        type: Sequelize.STRING, // Defining data type for 'password' as STRING
        allowNull:false // Ensuring it cannot be null
    },
    ispremiumuser:{
       type: Sequelize.BOOLEAN, // Defining data type for 'ispremiumuser' as BOOLEAN
       allowNull: true, // Allowing it to be nullable
    },
    totalExpense:{
        type: Sequelize.DOUBLE, // Defining data type for 'totalExpense' as DOUBLE
        defaultValue: 0 // Setting a default value of 0 for totalExpense
    }
})

module.exports = Users; // Exporting the Users model for use in other parts of the application



// const Sequelize = require('sequelize');: Imports the Sequelize library, an ORM for Node.js that supports various SQL databases.

// const sequelize = require('../util/database');: Imports the configured Sequelize instance, which holds the connection details to the database.

// const Users = sequelize.define('users', { ... });: Defines a Sequelize model named 'Users' using the define() method. This model represents the 'users' table in the database.

// id: { ... }: Defines the 'id' field in the 'users' table with specifications such as data type (INTEGER), auto-increment, not allowing null values, and marking it as the primary key.

// name: { type: Sequelize.STRING }: Defines the 'name' field with the data type STRING.

// email: { type: Sequelize.STRING, ... }: Defines the 'email' field with the data type STRING, not allowing null values, and making it unique in the database. It also provides a custom error message for duplicate emails.

// password: { type: Sequelize.STRING, ... }: Defines the 'password' field with the data type STRING and not allowing null values.

// ispremiumuser: { type: Sequelize.BOOLEAN, ... }: Defines the 'ispremiumuser' field with the data type BOOLEAN and allowing it to be nullable.

// totalExpense: { type: Sequelize.DOUBLE, ... }: Defines the 'totalExpense' field with the data type DOUBLE and sets a default value of 0 for it.

// module.exports = Users;: Exports the 'Users' model, making it available for use in other parts of the application that require interaction with the 'users' table in the database.