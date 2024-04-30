import { connectDB } from '../../utils/db'
import { ITEMS_PER_PAGE } from '../../utils/const'

/**
 *
 * @desc    Get All Services
 * @route   GET /services/:page
 * @access  Private
 * @param   {object} req - Request object
 */
export const getServices = async (req: any, res: any) => {
  const page = Number(req.params.page) || 1
  const employeeId = req.query.employeeId
  const offset = (page - 1) * ITEMS_PER_PAGE

  // query employeeId to check the role
  const queryEmployee = `SELECT role FROM system_employee_info WHERE employee_id = ?`
  const [rows]: any = await connectDB.query(queryEmployee, [employeeId])

  // construct the query to get the services and the total count of services
  const query =
    employeeId && rows[0].role !== 'admin'
      ? `SELECT * FROM services WHERE employee_id = ? LIMIT ? OFFSET ?`
      : `SELECT * FROM services LIMIT ? OFFSET ?`

  const getTotalQuery =
    employeeId && rows[0].role !== 'admin'
      ? `SELECT COUNT(*) as total FROM services WHERE employee_id = ?`
      : `SELECT COUNT(*) as total FROM services`

  try {
    // Get total count of services
    const [totalCountRows]: any = await connectDB.query(getTotalQuery, [employeeId])
    const totalServices = totalCountRows[0].total

    // Get services' information from the database
    const [rows]: any = await connectDB.query(
      query,
      employeeId ? [employeeId, ITEMS_PER_PAGE, offset] : [ITEMS_PER_PAGE, offset]
    )

    // Send the fetched data as a response along with total count
    res.status(200).json({ rows, totalServices })
  } catch (error: any) {
    // If an error occurs, send the error message as a response
    res.status(500).json({ error: error.message })
  }
}
