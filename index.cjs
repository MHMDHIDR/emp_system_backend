require('dotenv').config()
const express = require('express')
const cors = require('cors')
const logger = require('./middleware/logger.cjs')
const employeesRoutes = require('./routes/employees/index.js')
const customersRoutes = require('./routes/customers/index.js')
const servicesRoutes = require('./routes/services/index.js')
const receiptsRoutes = require('./routes/receipts/index.js')
const officeDetailsRoutes = require('./routes/office-details/index.js')

const app = express()
const { PORT } = process.env

app.use(cors())
app.use(logger('full'))
app.use(express.json())

// All routes for the employee
app.use('/employees', employeesRoutes)
app.use('/customers', customersRoutes)
app.use('/services', servicesRoutes)
app.use('/receipts', receiptsRoutes)
app.use('/office-details', officeDetailsRoutes)
app.get('/', (_req, res) => {
  res.send('Hello World!')
})

// Start the server
app.listen(PORT, () => console.log(`[🛜 == SERVER is running on PORT == ${PORT}]`))

module.exports = app
