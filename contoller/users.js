const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User registration/signup
exports.signUp = async (req, res) => {
    try {
        // Destructuring user details from the request body
        const { name, email, password } = req.body;
        
        // Hashing the provided password
        const hashPassword = await bcrypt.hash(password, 10);

        // Creating a new user record in the database
        const users = await Users.create({ name, email, password: hashPassword });
        
        // Sending a success response with the created user data
        res.status(200).json(users);
    } catch (err) {
        // Handling errors, particularly unique constraint violations for email addresses
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: 'Email address already in use!' });
        } else {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

// SignUp Function
// exports.signUp = async (req, res) => { ... }: This is a controller function to handle user registration.
// const { name, email, password } = req.body;: Destructures name, email, and password from the request body.
// const hashPassword = await bcrypt.hash(password, 10);: Uses bcrypt to hash the provided password with a salt factor of 10.
// const users = await Users.create({ name, email, password: hashPassword });: Creates a new user record in the database using the Users model with hashed password.
// Sending Response:
// res.status(200).json(users);: Sends a success response with the created user data.
// Error Handling:
// Catches SequelizeUniqueConstraintError for duplicate email addresses and responds with a 400 status code and an error message.
// Handles other errors with a 500 status code and a generic error message.




// Function to generate JWT token
exports.generateToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId: id, name: name, ispremiumuser }, "secretKey");
}

// Certainly! The function generateToken is responsible for creating a JSON Web Token (JWT) using the jsonwebtoken library. Let's break down the function and its purpose:

// JWT (JSON Web Token)
// JWT: It's a compact, URL-safe means of representing claims to be transferred between two parties. These tokens are digitally signed to ensure integrity and authenticity.
// generateToken Function:
// Purpose: This function is used to generate a JWT token based on the provided parameters: id, name, and ispremiumuser.
// Parameters:
// id: Represents the user's unique identifier.
// name: Represents the user's name or any identifying information.
// ispremiumuser: Indicates whether the user is a premium user (true/false).
// jwt.sign Method (from jsonwebtoken library):
// jwt.sign(payload, secretOrPrivateKey): This method generates a JWT token based on the provided payload and a secret key.
// Payload: Contains the data or claims you want to include in the token. In this case, it includes userId, name, and ispremiumuser.
// Secret Key: The second parameter is the secret or private key used for signing the token. It's crucial for verifying the authenticity of the token when it's received back.




// User login authentication
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Finding a user by email in the database
        const users = await Users.findOne({ where: { email: email } });

        // Checking if the user exists and validating the password
        const isPasswordValid = await bcrypt.compare(password, users.password);
        if (!users) {
            res.status(401).json("email or phone Number is not found");
        } else if (!isPasswordValid) {
            res.status(401).json("wrong password");
        } else {
            // Responding with a success message and a generated token upon successful login
            res.status(200).json({
                message: "users logged in successfully",
                token: exports.generateToken(users.id, users.name, users.ispremiumuser)
            });
        }
    } catch (err) {
        console.log(err);
    }
}

// exports.login = async (req, res) => { ... }: This function is exported and handles the user login logic. It takes in the request (req) and response (res) objects.

// const { email, password } = req.body;: Destructures the email and password from the request body for user input validation.

// const users = await Users.findOne({ where: { email: email } });: Uses Sequelize's findOne method to retrieve a user based on the provided email from the request body.

// const isPasswordValid = await bcrypt.compare(password, users.password);: Compares the hashed password from the database with the input password using bcrypt.compare() to validate the user's password.

// if (!users) { ... } else if (!isPasswordValid) { ... } else { ... }: Checks whether the user exists and whether the provided password is valid. If the user or password is invalid, it returns an appropriate error response (status code 401).

// res.status(200).json({ ... }): If the user exists and the password is valid, it responds with a success status code (200) and a JSON object containing a success message ("users logged in successfully") and a generated token using exports.generateToken().

// exports.generateToken(users.id, users.name, users.ispremiumuser): Calls a function (generateToken()) to generate a token based on user details like id, name, and ispremiumuser. This token likely uses JSON Web Tokens (JWT) for authentication purposes.






exports.isPremium = async (req, res) => {
    try {
        // Extracting user ID from the token (assuming it's done by a middleware)
        const userId = req.user.id;

        // Fetching the user from the database
        const user = await Users.findByPk(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Checking if the user is a premium user and responding with the result
        const isPremiumUser = user.ispremiumuser;
        res.status(200).json({ ispremiumuser: isPremiumUser });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Explanation:

// exports.isPremium = async (req, res) => { ... }: This function handles the logic for checking if a user is a premium user. It expects the request (req) and response (res) objects.

// const userId = req.user.id;: Retrieves the user ID from the request object. This assumes that a middleware has already decoded the user ID from the token and added it to the request (req.user.id).

// const user = await Users.findByPk(userId);: Uses Sequelize's findByPk method to find the user in the database based on the extracted user ID.

// if (!user) { ... }: Checks if the user exists. If the user is not found, it returns a 404 status code with a "User not found" message.

// const isPremiumUser = user.ispremiumuser;: Retrieves the ispremiumuser attribute from the user fetched from the database.

// res.status(200).json({ ispremiumuser: isPremiumUser });: Sends a JSON response with the user's premium status (ispremiumuser) with a status code of 200 (OK) if the user is found. If an error occurs during the process, it logs the error and sends a 500 status code (Internal Server Error) as a response.