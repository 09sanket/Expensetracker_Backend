const Expenses = require("../models/expenses");
const Users = require('../models/users');
const sequelize = require("../util/database");
const AWS = require('aws-sdk');
require('dotenv').config();

// Dependencies Import:

// Expenses and Users models are imported from their respective files.
// sequelize is imported, which represents the configured Sequelize instance.
// AWS (Amazon Web Services) SDK is imported, enabling interaction with various AWS services.
// AWS SDK Initialization:

// require('dotenv').config() loads environment variables from a .env file, enabling access to sensitive AWS configuration details without hardcoding them in the codebase.
// The use of AWS SDK suggests that the application might interact with various AWS services like S3 for storage, SES for sending emails, or other AWS services based on the requirements of the application. The initialization of the AWS SDK sets the foundation for utilizing these services within the application





// Function to add an expense
exports.addExpense = async (req, res) => {
    // Begin a transaction
    const t = await sequelize.transaction();
    try {
        const { amount, description, category } = req.body;
        // Create a new expense record in the database
        const result = await Expenses.create({
            amount,
            description,
            category,
            userId: req.user.id,
        }, { transaction: t });

        // Calculate the total expenses of the user
        const totalExpenses = Number(req.user.totalExpense) + Number(result.amount);

        // Update the user's totalExpense within the same transaction
        await Users.update({ totalExpense: totalExpenses }, { where: { id: req.user.id }, transaction: t });

        // Commit the transaction
        await t.commit();

        // Respond with the added expense details
        res.status(200).json({ expense: result });
    } catch (err) {
        // Rollback the transaction in case of an error
        await t.rollback();
        console.log(err);
        res.status(500).json("Internal Error has happened");
    }
}

// Transaction Handling:

// It starts a transaction t using sequelize.transaction() to ensure atomicity and consistency in database operations. If any part of the operation fails, the entire transaction can be rolled back.
// Expense Creation:

// It extracts amount, description, and category from the request body to create a new expense record in the database using Expenses.create().
// The userId field is linked to the authenticated user (req.user.id).
// Updating User's Total Expenses:

// It calculates the total expenses of the user by adding the current expense's amount to the user's existing totalExpense.
// Then, it updates the totalExpense field for the user in the Users model using Users.update() within the same transaction.
// Transaction Management:

// Upon successful addition and update, the transaction is committed (t.commit()).
// In case of an error, the transaction is rolled back to maintain data integrity (t.rollback()).
// Response:

// It responds with the added expense details in a JSON format.




// Function to download expense details
exports.download = async (req, res) => {
    try {
        // Retrieve all expenses associated with the user
        const expenses = await Expenses.findAll({
            where: { userId: req.user.id },

//     Expenses seems to represent a Sequelize model (assuming it's defined in your code) that represents the table or collection for expenses in your database.

// findAll is a Sequelize function used to retrieve multiple records from the database based on specified criteria.

// where: { userId: req.user.id } is a query condition defined using Sequelize's where clause. It indicates that Sequelize should find all records in the Expenses table where the userId column matches the id of the authenticated user making the request (req.user.id).
        });

        // Convert expenses to a string format
        const stringyfyExpense = JSON.stringify(expenses);

        // Generate a unique filename for the user's expenses
        const userId = req.user.id;
        const filename = `Expense${userId}/${new Date()}.txt`;

        // Upload the expenses data to AWS S3 and obtain the file URL
        const fileUrl = await uploadToS3(stringyfyExpense, filename);

        // Respond with the URL for downloading the file
        res.status(200).json({ fileUrl, success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ fileUrl: '', success: false, err: err });
    }
}

// This function download handles the generation and upload of expenses associated with a user to an AWS S3 bucket:

// Fetching User Expenses:

// It retrieves all expenses associated with the authenticated user from the database using Expenses.findAll().

// Data Conversion and File Generation:

// Converts the fetched expenses into a string format using JSON.stringify(expenses).
// Generates a unique filename for the expenses file based on the user's ID and the current timestamp.
// AWS S3 Upload:

// Calls the uploadToS3 function (not shown) passing the stringified expenses and the generated filename. This function likely utilizes the AWS SDK (AWS.S3) to upload the expenses data to an S3 bucket.
// Response:

// If successful, responds with a JSON object containing the fileUrl where the file can be downloaded and a success status set to true.
// If an error occurs during the process, it logs the error, responds with an empty fileUrl, and sets success to false, along with the specific error in the response.






// Function to upload data to AWS S3
function uploadToS3(data, filename){
    // Retrieve AWS S3 credentials from environment variables
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    // Set up AWS S3 configuration using credentials and bucket name
    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME
    });

    // Define parameters for S3 upload
    var params = {
        Bucket: BUCKET_NAME,
        Body: data,
        Key: filename,
        ACL: 'public-read'
    };

    // Return a Promise for S3 file upload
    return new Promise((resolve, reject) => {
        // Upload data to AWS S3 bucket
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('Error occurred during S3 upload');
                reject(err);
            } else {
                // Resolve with the URL of the uploaded file in S3
                resolve(s3response.Location);
            }
        });
    });
}
// This function, uploadToS3, handles the uploading of data to an AWS S3 bucket:

// Fetching AWS Credentials:

// Retrieves the necessary AWS S3 credentials from environment variables (BUCKET_NAME, IAM_USER_KEY, IAM_USER_SECRET).
// AWS S3 Configuration:

// Sets up the AWS S3 configuration using the retrieved credentials and bucket name by creating an instance of AWS.S3 with the specified access key ID, secret access key, and bucket name.
// S3 Upload Parameters:

// Defines parameters required for S3 upload, including the bucket name, data to be uploaded (Body), filename (Key), and access control settings (ACL).
// S3 Upload Process:

// Initiates an upload to the AWS S3 bucket using s3bucket.upload.
// It returns a Promise, either resolving with the URL (s3response.Location) of the uploaded file in the S3 bucket if successful or rejecting with an error if any occurs during the upload process.




// Retrieve and paginate expenses
exports.getExpense = async(req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const offset = (page - 1) * limit;

        // Count total number of expenses
        const totalCount = await Expenses.count(/*whereClause*/);

        // Retrieve expenses based on pagination parameters
        const expenses = await Expenses.findAll({
            offset,
            limit,
        });

        // Calculate total pages based on pagination limit
        const totalPages = Math.ceil(totalCount / limit);

        // Respond with paginated expenses and total count
        res.status(200).json({
            expenses,
            totalCount,
            totalPages
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// This function getExpense retrieves and paginates expenses:

// Pagination Parameters:

// Parses the page and limit query parameters from the request or sets default values (page=1 and limit=10 if not provided).
// Calculates the offset based on the current page and limit to determine where to start fetching the expenses.
// Total Count of Expenses:

// Counts the total number of expenses in the database, considering any optional conditions specified in the whereClause.
// Retrieving Paginated Expenses:

// Retrieves expenses from the database based on the pagination parameters (offset and limit) using Expenses.findAll.
// Calculating Total Pages:

// Determines the total number of pages required for pagination based on the total count of expenses and the specified limit.
// Response:

// Responds with a JSON object containing the paginated expenses (expenses), the total count of expenses (totalCount), and the calculated total pages (totalPages).





exports.deleteExpense = async (req, res) => {
    const t = await sequelize.transaction(); // Begin a transaction

    const Id = req.params.id; // Retrieve the expense ID from the request parameters

    try {
        // Find the expense being deleted to retrieve its amount
        const expense = await Expenses.findOne({
            where: { id: Id, userId: req.user.id }, // Search for the expense using ID and user ID
            transaction: t, // Associate with the ongoing transaction
        });

        if (!expense) {
            // If the expense is not found or doesn't belong to the user, return a 404 response
            console.log(`Expense with ID ${Id} not found for user ${req.user.id}`);
            res.status(404).json('This expense does not belong to you.');
            await t.rollback(); // Rollback the transaction
            return;
        }

        // Delete the expense matching the provided ID and user ID
        await Expenses.destroy({
            where: { id: Id, userId: req.user.id },
            transaction: t, // Associate with the ongoing transaction
        });

        // Calculate the updated totalExpense for the user by deducting the deleted expense amount
        const totalExpense = Number(req.user.totalExpense) - Number(expense.amount);

        // Update the user's totalExpense in the Users model
        await Users.update(
            { totalExpense: totalExpense }, // Set the new totalExpense value
            { where: { id: req.user.id }, transaction: t } // Update for the specific user and associate with the ongoing transaction
        );

        // Commit the transaction since everything was successful
        await t.commit(); // Commit the transaction changes

        // Respond with a success message after successfully deleting the expense
        res.status(200).json('Deleted');
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        // Rollback the transaction in case of an error
        await t.rollback(); // Rollback the transaction changes
        res.status(500).json('Internal Server Error'); // Respond with a 500 error status
    }
}



// This deleteExpense function handles the deletion of an expense:

// Transaction Initialization:

// Initiates a Sequelize transaction (t) to ensure atomicity of multiple database operations.
// Expense Identification:

// Retrieves the expense ID from the request parameters (req.params.id).
// Finds the expense to be deleted, associated with the authenticated user, using the expense ID and user ID.
// Expense Verification:

// Checks if the expense exists and belongs to the user. If not found or not associated with the user, it returns a 404 response and rolls back the transaction.
// Expense Deletion:

// Deletes the expense from the Expenses model based on the expense ID and user ID.
// Total Expense Update:

// Calculates the updated totalExpense of the user by subtracting the deleted expense's amount from the current totalExpense.
// Updates the totalExpense for the user in the Users model.
// Transaction Management:

// Commits the transaction if all operations are successful.
// Rolls back the transaction in case of any errors during the deletion or update processes.
// Response:

// Responds with a success message upon successful deletion of the expense.
// Provides appropriate error handling and status codes (500 for server error, 404 for not found) when necessary.