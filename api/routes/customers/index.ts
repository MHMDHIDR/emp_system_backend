import { Router } from 'express'

import { addCustomer } from './addCustomer'
import { getCustomers } from './getCustomers'
import { getCustomerById } from './getCustomerById'
import { editCustomerById } from './editCustomerById'
import { deleteCustomerById } from './deleteCustomerById'

const customers = Router()

// Use the route handlers with router.get
customers.post('/addCustomer', addCustomer)
customers.get('/:page(\\d+)?', getCustomers)
customers.get('/byId/:id', getCustomerById)
customers.delete('/delete_customer/:id', deleteCustomerById)
customers.patch('/editById/:id', editCustomerById)

export default customers
