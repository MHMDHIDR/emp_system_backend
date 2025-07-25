import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import logger from './middleware/logger'
import employeesRoutes from './routes/employees'
import customersRoutes from './routes/customers'
import servicesRoutes from './routes/services'
import receiptsRoutes from './routes/receipts'
import expensesRoutes from './routes/expenses'
import officeDetailsRoutes from './routes/office-details'

const app = express()
const { PORT } = process.env

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174']
  })
)
app.use(logger('full') as express.RequestHandler)
app.use(express.json())

// All routes for the employee
app.use('/employees', employeesRoutes)
app.use('/customers', customersRoutes)
app.use('/services', servicesRoutes)
app.use('/receipts', receiptsRoutes)
app.use('/expenses', expensesRoutes)
app.use('/office-details', officeDetailsRoutes)
app.get('/', (req: any, res: { send: (arg0: string) => void }) => {
  res.send('Hello World!')
})

// Start the server
app.listen(PORT, () => {
  console.log(
    '\x1b[34m',
    `[     SERVER is running    ]\n[✅ http://localhost:${PORT}  ✅]`
  )
})

export default app
