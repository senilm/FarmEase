import express from 'express'
import { addExpense, getExpense, getExpenses, updateExpense, deleteExpense } from '../controllers/expense.js'
const router = express.Router()


router.route('/').get(getExpenses)
router.route('/:expenseId').get(getExpense)
router.route('/:expenseId').delete(deleteExpense)
router.route('/:expenseId').patch(updateExpense)
router.route('/').post(addExpense)


export default router