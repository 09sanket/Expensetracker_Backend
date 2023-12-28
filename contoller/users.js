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

// Function to generate JWT token
exports.generateToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId: id, name: name, ispremiumuser }, "secretKey");
}

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

// Check if a user is a premium user
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
