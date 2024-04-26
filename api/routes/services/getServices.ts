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
  const page = req.params.page || 1
  const employeeId = req.query.employeeId
  const offset = (page - 1) * ITEMS_PER_PAGE

  // construct the query to get the services and the total count of services
  const query = employeeId
    ? `SELECT * FROM services WHERE employee_id = ? LIMIT ? OFFSET ?`
    : `SELECT * FROM services LIMIT ? OFFSET ?`

  const getTotalQuery = employeeId
    ? `SELECT COUNT(*) as total FROM services WHERE employee_id = ?`
    : `SELECT COUNT(*) as total FROM services`

  try {
    // Get total count of services
    const [totalCountRows]: any = await connectDB.query(getTotalQuery, [employeeId])
    const totalServices = totalCountRows[0].total

    // Get services' information from the database
    const [rows]: any = await connectDB.query(query, [employeeId, ITEMS_PER_PAGE, offset])

    // Send the fetched data as a response along with total count
    res.status(200).json({ rows, totalServices })
  } catch (error: any) {
    // If an error occurs, send the error message as a response
    res.status(500).json({ error: error.message })
  }
}
