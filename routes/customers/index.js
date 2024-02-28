const express = require('express')

const { addCustomer } = require('./addCustomer.js')
const { getCustomers } = require('./getCustomers.js')
const { getCustomerById } = require('./getCustomerById.js')
const { editCustomerById } = require('./editCustomerById.js')
const { deleteCustomerById } = require('./deleteCustomerById.js')

const customers = express.Router()

// Use the route handlers with router.get
customers.post('/addCustomer', addCustomer)
customers.get('/:page(\\d+)?', getCustomers)
customers.get('/byId/:id', getCustomerById)
customers.delete('/delete_customer/:id', deleteCustomerById)
customers.patch('/editById/:id', editCustomerById)

module.exports = customers
