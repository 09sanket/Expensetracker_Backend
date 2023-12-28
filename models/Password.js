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
