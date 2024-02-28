// Required dependencies
const express = require('express'); // Importing the Express framework
const sequelize = require('./util/database'); // Sequelize instance for database connection
const bodyParser = require('body-parser'); // Parsing incoming request bodies
const app = express(); // Creating an Express application
const cors = require('cors'); // Cross-Origin Resource Sharing
const helmet = require('helmet'); // Adding security-related headers
const morgan = require('morgan'); // HTTP request logger
const fs = require('fs'); // File system module for handling files
const path = require('path'); // Path module for working with file and directory paths


// express: This is the Node.js framework for building web applications. It's used to create the server and handle HTTP requests and responses.
// sequelize: This seems to be an instance of Sequelize, a popular ORM (Object-Relational Mapping) for Node.js, used for interacting with databases.
// body-parser: Middleware used to parse incoming request bodies in a middleware before handlers.
// app: An instance of the Express application, which is used to configure routes, middleware, and manage HTTP requests.
// cors: Middleware for enabling Cross-Origin Resource Sharing, allowing different domains to make requests to your server.
// helmet: Middleware used for adding security-related HTTP headers to the responses.
// morgan: Middleware for logging HTTP requests.
// fs: Node.js module for handling file operations.
// path: Node.js module for handling and transforming file paths

// --------------------------------------------------------------------------------------------------------------------------------------------- 


// Importing route handlers

const UsersRouter = require('./routes/users'); // Importing the router for handling user-related routes
const expenseRouter = require('./routes/expenses'); // Importing the router for handling expense-related routes
const OrderRouter = require('./routes/purchase'); // Importing the router for handling purchase/order-related routes
const premiumFeatureRouter = require('./routes/premiumFeature'); // Importing the router for managing premium features/routes
const PasswordRouter = require('./routes/password');// Importing the router for handling password-related routes

// UsersRouter: This likely handles routes related to user authentication, registration, profiles, or user-related functionalities.
// expenseRouter: This file probably contains route handlers for managing expenses, including adding, retrieving, updating, or deleting expenses.
// OrderRouter: This might handle routes associated with purchases or payments within your application. It could be connected to the integration with a payment gateway like Razorpay.
// premiumFeatureRouter: This file likely manages routes related to premium features or memberships in your application.
// PasswordRouter: This could handle routes for password-related functionalities such as resetting passwords, changing passwords, or handling forgot password requests.
// ----------------------------------------------------------------------------------------------------------------------------------------------------- 


// Importing models

const Users = require('./models/users'); // Importing the Users model - likely represents the user data in your application
const Expense = require('./models/expenses');// Importing the Expense model - likely represents the expense data in your application
const Orders = require('./models/orders');/// Importing the Orders model - likely represents orders or purchases made in your application
const Password = require('./models/Password'); // Importing the Password model - likely represents password-related data in your application
const dotenv = require('dotenv'); // Importing 'dotenv' for loading environment variables from a .env file
dotenv.config(); // Loading environment variables from .env file


// Logging access information to a file

// Creating a write stream to log access information to a file named 'access.log'
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'), { flag: 'a' }
);

// Models: These imports (Users, Expense, Orders, Password) likely represent the database models for different entities in your application, such as users, expenses, orders, and password-related data. These models are presumably defined using Sequelize or a similar ORM (Object-Relational Mapping) to interact with your database tables.
// Dotenv: dotenv is a package used to load environment variables from a .env file into process.env. This allows you to store configuration and sensitive information (like database credentials) in a separate file and access them within your application using process.env.
// Logging: The code creates a write stream using fs.createWriteStream() to set up logging of access information to a file named 'access.log'. It appends ({ flag: 'a' }) new log information to the existing file.

// ------------------------------------------------------------------------------------------------------------------------------------------------- 



// Middleware setup
app.use(bodyParser.urlencoded({ extended: false })); // Parsing form URL-encoded data and handling it using bodyParser
app.use(express.json()); // Parsing incoming JSON payloads
app.use(cors()); // Handling Cross-Origin Resource Sharing (CORS)
app.use(helmet());// Adding security-related headers to responses
app.use(morgan('combined', { stream: accessLogStream }));// HTTP request logger using morgan and directing logs to the accessLogStream


// Root route response - sending a simple text response for the root URL ('/')
app.get('/', (req, res) => {
    res.send('hello from serverrrrrr');
});

// BodyParser: It configures bodyParser middleware to handle URL-encoded form data.
// Express JSON: This middleware parses incoming JSON payloads.
// CORS: cors middleware handles Cross-Origin Resource Sharing, allowing different origins to access your server's resources.
// Helmet: It adds security-related HTTP headers to the responses for enhanced security.
// Morgan: morgan middleware sets up an HTTP request logger, logging requests with the 'combined' format and directing the logs to the accessLogStream you previously created.
// Root Route: A simple route handler for the root URL '/', which responds with 'hello from serverrrrrr'. This is a basic route to verify that the server is running and responding correctly.

// ----------------------------------------------------------------------------------------------------------------------------------------------


// Using defined routes for specific endpoints

app.use('/add', UsersRouter);// Mounting the UsersRouter for paths starting with '/add'
app.use('/expense', expenseRouter);// Mounting the expenseRouter for paths starting with '/expense'
app.use('/purchase', OrderRouter);// Mounting the OrderRouter for paths starting with '/purchase'
app.use('/premium', premiumFeatureRouter);// Mounting the premiumFeatureRouter for paths starting with '/premium'
app.use('/password', PasswordRouter); // Mounting the PasswordRouter for paths starting with '/password'

// app.use(): This method in Express is used for mounting middleware or routers to specific paths.
// Routes Configuration: Each app.use() statement associates a specific router (UsersRouter, expenseRouter, OrderRouter, premiumFeatureRouter, PasswordRouter) with a base path ('/add', '/expense', '/purchase', '/premium', '/password'). This means that any routes defined within these routers will be relative to these base paths.
// For example:
// Routes defined in UsersRouter will be accessible under paths starting with /add.
// Routes defined in expenseRouter will be accessible under paths starting with /expense, and so on for other routers.

// --------------------------------------------------------------------------------------------------------------- 

// Defining relationships between models (associations)

// Setting up associations between different Sequelize models
Users.hasMany(Expense); // Users can have multiple expenses
Expense.belongsTo(Users); // An expense belongs to a user

Users.hasMany(Orders); // Users can have multiple orders
Orders.belongsTo(Users); // An order belongs to a user

Users.hasMany(Password); // Users can have multiple password-related entries
Password.belongsTo(Users); // Password-related entries belong to a user



// Syncing Sequelize with the database and starting the server
// Synchronize Sequelize models with the database and start the server
sequelize.sync() // Sync Sequelize models with the database
    .then(() => {
        // Start the server and listen on a specified port or default port 8080
        app.listen(process.env.PORT || 8080, () => {
            console.log('server is running'); // Log message when the server starts
        });
    })
    .catch((err) => {
        console.log(err); // Log any errors that occur during synchronization or server startup
    });

// Associations: Sequelize provides methods like hasMany and belongsTo to define associations between models. These associations establish relationships such as one-to-many or many-to-one between different tables/entities in the database. For example, Users.hasMany(Expense) specifies that a user can have many expenses, and Expense.belongsTo(Users) indicates that an expense belongs to a user.
// Syncing Sequelize: The sequelize.sync() method synchronizes the defined Sequelize models with the database. It ensures that the tables in the database correspond to the models defined in your application.
// Starting the Server: Once the synchronization is successful, the code uses app.listen() to start the server. It listens for incoming HTTP requests on a specified port (process.env.PORT if available, or default port 8080). When the server starts successfully, it logs a message ('server is running') to the console.

// ---------------------------------------------------------------------------------------------------------------------------------------- 