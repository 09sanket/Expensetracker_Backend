const Users = require('../models/users'); // Importing Users model
const Password = require('../models/Password'); // Importing Password model
const Sib = require('sib-api-v3-sdk'); // Importing the Sendinblue API library
const uuid = require('uuid'); // Importing UUID library for generating unique identifiers
const bcrypt = require('bcrypt'); // Importing bcrypt for password hashing
require('dotenv').config(); // Loading environment variables from .env file

// Model Imports:

// Users and Password are being imported from their respective model files (../models/users, ../models/Password).
// API and Libraries:

// Sib library is imported, likely related to the Sendinblue API. This library enables interaction with Sendinblue services.
// uuid library is used for generating unique identifiers (UUIDs).
// bcrypt library is imported for password hashing, a common technique to securely store passwords.
// Environment Variables:

// dotenv is used to load environment variables from a .env file, allowing secure storage of sensitive data like API keys, passwords, etc.


// Questions to Consider:

// Purpose of Sendinblue Integration: How is the Sendinblue library used within the application? For sending emails, managing templates, or other functionalities?
// Sendinblue Integration:
// Sendinblue library might be used for sending transactional emails or managing email campaigns, such as sending notifications, newsletters, or verification emails to users.

// Password Handling: How are passwords hashed using bcrypt, and what functions/modules utilize this for user authentication?
// Password Handling with bcrypt:
// bcrypt is likely used to hash passwords before storing them in the database, ensuring security. It's often used in user authentication processes to compare hashed passwords during login.

// UUID Generation: In what scenarios are UUIDs generated and utilized within the application?
// UUID Generation:
// UUIDs are commonly generated and utilized for unique identifiers in scenarios like creating unique tokens for password reset links, generating unique session IDs, or ensuring unique IDs for certain database entries to avoid conflicts.





// Endpoint to handle the 'forgot password' functionality
exports.forgetPassword = async (req, res) => {
    try {
        // Initializing the Sendinblue API client
        var defaultClient = Sib.ApiClient.instance;
        var apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;

        // Retrieving the email from the request body
        const { email } = req.body;

        // Finding the user by the provided email in the database
        const user = await Users.findOne({ where: { email: email } });

        if (!user) {
            // Responding with an error if the email is not registered
            res.status(404).json('Email is not Registered');
            return; // Return here to prevent further execution
        }

        // Generating a unique ID for the password reset request
        const id = uuid.v4();

        // Creating a new entry in the 'Password' model to store the reset request
        await Password.create({ id, userId: user.id, active: true });

        // Constructing the email content for the password reset link
        const sender = { name: "Amar Manhar", email: "nkamar1412@gmail.com" };
        const to = [{ email: email }];
        const subject = "Reset Your Password";
        const htmlContent = `<a href="http://localhost:8080/password/resetpassword/${id}">Reset password</a>`;

        // Configuring the email to be sent using Sendinblue
        const apiInstance = new Sib.TransactionalEmailsApi();
        const sendSmtpEmail = new Sib.SendSmtpEmail();
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.to = to;
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = htmlContent;

        // Sending the password reset email
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        
        // Responding with a success message after sending the reset password link
        res.status(200).json('Reset password link has been sent');
    } catch (err) {
        // Handling errors if there's an issue sending the email
        console.log(err);
        res.status(500).json("Failed to send reset password link");
    }
};




// This code snippet represents an endpoint (forgetPassword) responsible for the "forgot password" functionality in an application. Here's a breakdown:

// Sendinblue Initialization: Initializes the Sendinblue API client using the provided API key fetched from environment variables.

// Request Data: Extracts the email from the request body submitted by the user.

// User Validation: Searches for a user with the provided email in the database. If no user is found, it returns a 404 error indicating that the email is not registered.

// Password Reset Request: Generates a unique ID using UUID for the password reset request and creates an entry in the Password model to store this request with the associated user ID.

// Construct Email Content: Constructs an email content containing a password reset link based on the generated ID. This link is embedded in an anchor tag (<a>) leading to a route for resetting the password.

// Send Email: Uses Sendinblue's API to configure and send an email to the user's provided email address. The email contains the password reset link.

// Response Handling: If the email is sent successfully, it responds with a 200 status and a message indicating that the reset password link has been sent. In case of any errors during this process, it catches the error, logs it, and responds with a 500 status, indicating a failure to send the reset password link.





// Endpoint to render the password reset form with HTML content
exports.resetPassword = async(req, res)=>{
    try {
        const id = req.params.id;
        console.log('ID is :-- ', id);

        // Find the password reset request in the database by its unique ID
        const forgetPasswordRequest = await Password.findOne({where :{id }});
        
        if(forgetPasswordRequest){
            // Update the 'active' status of the password reset request to false
            forgetPasswordRequest.update({active:false});
        }
        
        // HTML content for the password reset form
        const html = `
            <html>
                <script>
                    function formsubmitted(e){
                        e.preventDefault();
                        console.log('called')
                    }
                </script>

                <form action="http://localhost:8080/password/updatepassword/${id}" method="get">
                    <label for="newpassword">Enter New password</label>
                    <input name="newpassword" type="password" required></input>
                    <button>reset password</button>
                </form>
            </html>
        `;

        // Send the HTML content of the password reset form as the response
        res.status(200).send(html);
        res.end();
    } catch (err) {
        console.log(err);
    }
};

// Request Parameter Extraction: Retrieves the unique id parameter from the request URL (req.params.id). This ID is used to identify the password reset request.

// Database Lookup: Queries the database using Sequelize to find the password reset request associated with the provided ID.

// Update Password Reset Request: If the password reset request exists, it updates the 'active' status to false, indicating that the request has been used.

// HTML Form Content: Generates an HTML form within a string variable (html). The form contains an input field for the new password and a button to submit the form.

// Form Submission: Defines a JavaScript function (formsubmitted) within the HTML content to handle form submission. However, this function does not have any functionality defined other than logging.

// Sending HTML Response: Sends the HTML content (html) as a response when this endpoint is accessed. It responds with a 200 status code, rendering the password reset form in the browser.




// Endpoint to handle the password update process
exports.updatePassword = async (req, res)=>{
    try {
        const { newpassword } = req.query;
        const { id } = req.params; // Retrieve the unique ID from the request params

        // Find the password reset request based on the provided ID
        const resetpasswordrequest = await Password.findOne({ where: { id } });

        // Find the user associated with the password reset request
        const user = await Users.findOne({ where: { id: resetpasswordrequest.userId } });

        if (user) {
            // Hash the new password before updating the user's password
            const hashPassword = await bcrypt.hash(newpassword, 10);
            await user.update({ password: hashPassword });
            res.status(200).json("password reset successfully");
        } else {
            res.status(500).json({ error: 'No user Exists', success: false });
        }
    } catch (err) {
        console.log(err);
    }
};

// Request Parsing: Retrieves the newpassword from the query parameters (req.query) and the id from the request parameters (req.params).

// Database Queries:

// Finds the password reset request in the database using Sequelize based on the provided id.
// Retrieves the user associated with the password reset request using the userId stored in the reset request.
// Password Reset Process:

// If the user exists:
// Hashes the new password using bcrypt.hash.
// Updates the user's password with the hashed password.
// Responds with a success message upon successful password reset (res.status(200).json("password reset successfully")).
// If no user is found, it returns an error response indicating that no user exists (res.status(500).json({ error: 'No user Exists', success: false })).
// Error Handling: Contains a basic try...catch block to catch and log any errors that might occur during the password reset process.
