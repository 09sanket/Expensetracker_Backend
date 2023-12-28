const Users = require('../models/users'); // Importing the Users model
const jwt = require('jsonwebtoken'); // Importing the JSON Web Token library

// Middleware function to authenticate user based on JWT token
exports.Authenticate = async (req, res, next) => {
  try {
    // Extracting the JWT token from the request header
    const token = req.header("Authorization");

    // Verifying the token using the secret key to decode its payload
    const user = jwt.verify(token, "secretKey");

    // Finding the user in the database based on the decoded user ID from the token
    const foundUser = await Users.findByPk(user.userId);

    // Storing the found user in the request object for future use in subsequent middleware or routes
    req.user = foundUser;

    // Calling the next middleware function in the chain
    next();
  } catch (err) {
    // Handling any errors that might occur during token verification or user retrieval
    console.log(err);
  }
};
