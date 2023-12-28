const Users = require('../models/users');
const Password = require('../models/Password'); // Importing Password model
const Sib = require('sib-api-v3-sdk'); // Importing the Sendinblue API library
const uuid = require('uuid');
const bcrypt = require('bcrypt');
require('dotenv').config();

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
