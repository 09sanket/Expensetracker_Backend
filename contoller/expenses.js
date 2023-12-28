const Expenses = require("../models/expenses");
const Users = require('../models/users');
const sequelize = require("../util/database");
const AWS = require('aws-sdk');
require('dotenv').config();

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

// Function to download expense details
exports.download = async (req, res) => {
    try {
        // Retrieve all expenses associated with the user
        const expenses = await Expenses.findAll({
            where: { userId: req.user.id },
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
