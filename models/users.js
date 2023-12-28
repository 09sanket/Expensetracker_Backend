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
