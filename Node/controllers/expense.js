import prisma from "../utils/PrismaClient.js"

export const addExpense = async (req, res) => {
    try {
        const {amount, note, date} = req.body;
        const {id} = req.user;

        if(!note || !amount || amount <= 0){
            return res.status(400).json({message:"Please provide all the details"})
        }
    
        const expense = await prisma.expense.create({
            data:{
                amount:amount,
                note: note,
                date:date,
                User:{
                    connect:{
                        id:id
                    }
                }
            }
        });

        if(!expense){
            return res.status(400).json({message:"Failed to add expense"})
        }

        return res.status(200).json({message:"Successfully added expense"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Interval Server Error, Please try again later"})
    }
}

export const getExpenses = async (req, res) => {
    try {
        const {page, fromDate, toDate, dashboard} = req.query;

        const LIMIT = 6;
        const currentPage = page ? page : 1
        const skip = (currentPage - 1) * LIMIT;

        const filters = [];

        if(fromDate){
            filters.push({
                date:{
                    gte:new Date(fromDate),
                }
            })
        }

        if(toDate){
            const endOfDay = new Date(toDate);
            endOfDay.setHours(23, 59, 59, 999);

            filters.push({
                date: {
                    lte: endOfDay,
                }
            });
        }
        console.log(filters)
        let expenses = [];
        if(dashboard){
            expenses = await prisma.expense.findMany({
                where:{
                    AND:[...filters]
                },
                orderBy:{
                    date:'desc'
                }
            });
        }else{
            expenses = await prisma.expense.findMany({
                skip:skip,
                take:LIMIT,
                where:{
                    AND:[...filters]
                },
                orderBy:{
                    date:'desc'
                }
            });
        }
        const expensesData = expenses.length == 0 ? [] : expenses
        return res.status(200).json({expenses:expensesData});
    } catch (error) {
        return res.status(500).json({message:"Interval Server Error, Please try again later"})
    }
}

export const getExpense = async (req, res) => {
    try {
        const expenseId = req.params.expenseId;
        if(!expenseId){
            return res.status(400).json({message:"Please provide required details"})
        }

        const expense = await prisma.expense.findFirst({
            where:{
                id:expenseId
            }
        })
        if(!expense){
            return res.status(404).json({message:"Expense does not exist"})
        }
        return res.status(200).json({expense:expense});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Interval Server Error, Please try again later"})
    }
}

export const deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.expenseId;
        const {id} = req.user

        if(!expenseId){
            return res.status(400).json({message:"Please provide required details"})
        }

        const expense = await prisma.expense.delete({
            where:{
                id:expenseId,
                userId:id
            }
        })

        if(!expense){
            return res.status(404).json({message:"Failed to delete expense"})
        }

        return res.status(200).json({message:"Successfully deleted expense"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Failed to delete expense, Please try again later"})
    }
}

export const updateExpense = async (req, res) => {
    try {
        const expenseId = req.params.expenseId;
        const {date, amount, note} = req.body;

        if(!expenseId || !date || !note || !amount || amount <= 0){
            return res.status(400).json({message:"Please provide all the details"})
        }

        const expense = await prisma.expense.update({
            where:{
                id:expenseId
            },
            data:{
                date:date,
                amount:amount,
                note: note
            }
        })
        return res.status(200).json({message:"Successfully updated expense"});
    } catch (error) {
        console.log(error)
        if(error.code == 'P2025'){
            return res.status(404).json({message:"Record to update is not found"})
        }
        return res.status(500).json({message:"Interval Server Error, Please try again later"})
    }
}
