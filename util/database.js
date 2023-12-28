



// Importing necessary dependencies
const Sequelize = require('sequelize');
require('dotenv').config(); // Loading environment variables from .env file

// Creating a Sequelize instance with database configurations
const sequelize = new Sequelize(
    'exprensetracker',          // Database name
    process.env.DB_USERNAME,    // Username fetched from environment variables
    process.env.DB_PASSWORD,    // Password fetched from environment variables
    {
        dialect: 'mysql',       // Database dialect (MySQL in this case)
        host: 'localhost'       // Database host (localhost)
    }
);

module.exports = sequelize;    // Exporting the Sequelize instance for use in other files
