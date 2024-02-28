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

// const Users = require('../models/users');: Imports the Users model from the '../models/users' file.

// const jwt = require('jsonwebtoken');: Imports the JSON Web Token (JWT) library used for token-related operations.

// exports.Authenticate = async (req, res, next) => { ... };: Defines a middleware function named Authenticate exported as part of the module.

// try { ... } catch (err) { ... }: Begins a try-catch block to handle potential errors within the middleware.

// const token = req.header("Authorization");: Retrieves the JWT token from the request header labeled as "Authorization".

// const user = jwt.verify(token, "secretKey");: Verifies and decodes the received token using the provided "secretKey", resulting in the decoded payload (user information).

// const foundUser = await Users.findByPk(user.userId);: Searches for the user in the database based on the decoded user ID obtained from the token using the findByPk method.

// req.user = foundUser;: Stores the retrieved user information in the request object (req.user) to make it available for subsequent middleware or route handlers.

// next();: Invokes the next middleware function in the chain, signaling the completion of this middleware's processing.

// console.log(err);: Logs any errors that might occur during token verification or user retrieval to the console for debugging purposes.





// Users Model Import: It imports the Users model from the specified path ('../models/users'). This model likely represents the structure and operations related to users in your application.
// jsonwebtoken Import: It imports the 'jsonwebtoken' library necessary for working with JSON Web Tokens (JWT).

// Authenticate Middleware Function: This function is middleware designed to authenticate users based on a JWT token. It is typically used as a middleware in routes that require user authentication.
// req, res, next: These are Express middleware parameters representing the request, response, and next middleware function in the chain.
// Token Extraction: It extracts the JWT token from the request header with the key "Authorization".

// Token Verification: It verifies the extracted token using the provided secret key ("secretKey") to decode its payload.

// User Retrieval: It finds the user in the database using the decoded user ID obtained from the token using the findByPk method from the Users model.

// Storing User in Request Object: It stores the retrieved user object in the req.user property, making it available for subsequent middleware or routes in the request lifecycle.
// Error Handling: It includes a try-catch block to handle any errors that might occur during token verification or user retrieval, logging them to the console for debugging purposes.