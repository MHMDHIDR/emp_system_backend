const express = require('express')
const { login } = require('./login.js')
const { signup } = require('./signup.js')
const { getEmployees } = require('./getEmployees.js')
const { getEmployeeById } = require('./getEmployeeById.js')
const { editEmployeeById } = require('./editEmployeeById.js')
const { handleLogout } = require('./handleLogout.js')
const { deleteEmployeeById } = require('./deleteEmployeeById.js')

const employees = express.Router()

// Use the route handlers with router.get
employees.post('/add_emp', signup)
employees.post('/login', login)
employees.get('/:page(\\d+)?', getEmployees)
employees.delete('/delete_emp/:id', deleteEmployeeById)
employees.get('/byId/:id', getEmployeeById)
employees.patch('/editById/:id', editEmployeeById)
employees.patch('/logout', handleLogout)

module.exports = employees
