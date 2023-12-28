// Required dependencies
const express = require('express');
const sequelize = require('./util/database'); // Sequelize instance for database connection
const bodyParser = require('body-parser'); // Parsing incoming request bodies
const app = express();
const cors = require('cors'); // Cross-Origin Resource Sharing
const helmet = require('helmet'); // Adding security-related headers
const morgan = require('morgan'); // HTTP request logger
const fs = require('fs');
const path = require('path');

// Importing route handlers
const UsersRouter = require('./routes/users');
const expenseRouter = require('./routes/expenses');
const OrderRouter = require('./routes/purchase');
const premiumFeatureRouter = require('./routes/premiumFeature');
const PasswordRouter = require('./routes/password');

// Importing models
const Users = require('./models/users');
const Expense = require('./models/expenses');
const Orders = require('./models/orders');
const Password = require('./models/Password');

const dotenv = require('dotenv');
dotenv.config(); // Loading environment variables from .env file

// Logging access information to a file
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'), { flag: 'a' }
);

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); // Parsing incoming JSON payloads
app.use(cors()); // Handling Cross-Origin Resource Sharing (CORS)
app.use(helmet()); // Adding security-related headers to responses
app.use(morgan('combined', { stream: accessLogStream })); // HTTP request logger
app.get('/', (req, res) => {
    res.send('hello from serverrrrrr'); // Root route response
});

// Using defined routes for specific endpoints
app.use('/add', UsersRouter);
app.use('/expense', expenseRouter);
app.use('/purchase', OrderRouter);
app.use('/premium', premiumFeatureRouter);
app.use('/password', PasswordRouter);

// Defining relationships between models (associations)
Users.hasMany(Expense);
Expense.belongsTo(Users);

Users.hasMany(Orders);
Orders.belongsTo(Users);

Users.hasMany(Password);
Password.belongsTo(Users);

// Syncing Sequelize with the database and starting the server
sequelize.sync()
    .then(() => {
        app.listen(process.env.PORT || 8080, () => {
            console.log('server is running');
        });
    })
    .catch((err) => {
        console.log(err);
    });
