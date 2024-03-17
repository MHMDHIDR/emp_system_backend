import { Router } from 'express'

import { addExpense } from './addExpense'
import { getExpenses } from './getExpenses'
import { deleteExpensesById } from './deleteExpensesById'

const expenses = Router()

// Use the route handlers with router.get
expenses.post('/addExpense', addExpense)
expenses.get('/:page(\\d+)?', getExpenses)
expenses.delete('/delete_expense/:id', deleteExpensesById)

export default expenses
