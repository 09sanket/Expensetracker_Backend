// const Sequelize = require('sequelize');

// require('dotenv').config();

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT
// });

// module.exports = sequelize;


const Sequelize=require('sequelize');
require('dotenv').config();

const sequelize=new Sequelize('exprensetracker',process.env.DB_USERNAME,process.env.DB_PASSWORD,{
    dialect:'mysql',
    host:'localhost' 
});

module.exports=sequelize; 