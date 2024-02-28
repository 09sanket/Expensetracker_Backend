const Sequelize = require('sequelize'); // Importing Sequelize library
const seqelize = require("../util/database"); // Importing the configured Sequelize instance

// Creating a model for Password using Sequelize.define()
const Password = seqelize.define('password', {
    id: {
        type: Sequelize.UUID, // Defining data type for ID as UUID
        allowNull: false, // Ensuring it cannot be null
        primaryKey: true // Marking it as primary key
    },
    active: Sequelize.BOOLEAN, // Defining data type for 'active' as BOOLEAN
    expiresby: Sequelize.DATE // Defining data type for 'expiresby' as DATE
})

module.exports= Password; // Exporting the Password model for use in other parts of the application



// const Sequelize = require('sequelize');: Imports the Sequelize library, an ORM (Object-Relational Mapping) for Node.js that simplifies interactions with databases.

// const seqelize = require("../util/database");: Imports the configured Sequelize instance from the 'database.js' file in the 'util' folder. This instance holds the connection details to the database.

// const Password = seqelize.define('password', { ... });: Defines a Sequelize model named 'Password' using the define() method. This model represents the 'password' table in the database.

// id: { ... }: Defines the 'id' field in the 'password' table with specifications such as data type (UUID), not allowing null values, and marking it as the primary key.

// active: Sequelize.BOOLEAN: Defines the 'active' field with the data type BOOLEAN.

// expiresby: Sequelize.DATE: Defines the 'expiresby' field with the data type DATE.

// module.exports = Password;: Exports the 'Password' model, making it available for use in other parts of the application that require interaction with the 'password' table in the database.