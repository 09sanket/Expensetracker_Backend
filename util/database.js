



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


// Sequelize Import: Importing the Sequelize library required to create a Sequelize instance for database operations.
// dotenv Configuration: Loading environment variables from a .env file using dotenv for sensitive data like database credentials.
// Sequelize Instance Creation: Creating a new Sequelize instance with database configurations. It includes:
// Database name: 'exprensetracker'
// Username and password fetched from environment variables (process.env.DB_USERNAME and process.env.DB_PASSWORD respectively)
// Database dialect set to 'mysql' for MySQL database
// Database host set to 'localhost'
// Exporting Sequelize Instance: Exporting the configured Sequelize instance to make it available for use in other files within your application.