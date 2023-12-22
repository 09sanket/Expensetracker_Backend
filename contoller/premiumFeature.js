// // const Users = require('../models/users');
// // const Expenses = require("../models/expenses");
// // const sequelize = require('../util/database');

// // exports.getLeaderBoard = async(req, res)=>{

// //     try{
         
// //         const leaderboardData = await Users.findAll({
// //             attributes: ['id', 'name', 'totalExpense'],
// //             order:[['totalExpense', 'DESC']]

// //         });
// //        // console.log(leaderboardData);
// //         res.status(200).json(leaderboardData);

// //     }catch(err){
// //         console.log(err);
// //     }
// // }

// const userModel=require('../models/users');
// const expenseModel=require('../models/expenses');
// const sequelize=require('../util/database');

// exports.getLeaderboard=async(req,res,next)=>{
//         try{
//                 const lboardDetails=await userModel.findAll({
//                     attributes:['id','name','totalexpense'], 
//                     order:[['totalexpense','DESC']]
//                 });
//             // const lboardDetails=await userModel.findAll({
//             //     attributes:['id','name',[sequelize.fn('sum',sequelize.col('expenses.amount')),'expense']],
//             //     include:[
//             //         {
//             //             model:expenseModel,
//             //             attributes:[]
//             //         }
//             //     ],
//             //     group:['user.id'],
//             //     order:[['expense','DESC']]
//             // });
//             res.status(200).json(lboardDetails);
//         }
//         catch(err){
//             console.log(err);
//             res.status(500).json({err}); 
//         }
// }

const Users = require('../models/users');
const Expenses = require("../models/expenses");
const sequelize = require('../util/database');

exports.getLeaderBoard = async (req, res) => {
    try {
        const leaderboardData = await Users.findAll({
            attributes: ['id', 'name', 'totalExpense'],
            order: [['totalExpense', 'DESC']]
        });
        res.status(200).json(leaderboardData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
