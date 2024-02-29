import { Router } from 'express'
import { login } from './login'
import { signup } from './signup'
import { getEmployees } from './getEmployees'
import { getEmployeeById } from './getEmployeeById'
import { editEmployeeById } from './editEmployeeById'
import { handleLogout } from './handleLogout'
import { deleteEmployeeById } from './deleteEmployeeById'

const employees = Router()

// Use the route handlers with router.get
employees.post('/add_emp', signup)
employees.post('/login', login)
employees.get('/:page(\\d+)?', getEmployees)
employees.delete('/delete_emp/:id', deleteEmployeeById)
employees.get('/byId/:id', getEmployeeById)
employees.patch('/editById/:id', editEmployeeById)
employees.patch('/logout', handleLogout)

export default employees
