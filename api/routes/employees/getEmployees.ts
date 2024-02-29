import { connectDB } from '../../utils/db'
import { ITEMS_PER_PAGE } from '../../utils/const'

/**
 *
 * @desc    Get All Employees
 * @route   GET /api/employees/:page
 * @access  Public
 * @param {*} req
 * @param {*} res
 * @return  {Object} { rows, totalEmployees }
 * @return  {Object} { error }
 */
export const getEmployees = async (req: any, res: any) => {
  const page = req.params.page || 1
  const offset = (page - 1) * ITEMS_PER_PAGE

  try {
    // Get total count of employees
    const [totalCountRows]: any = await connectDB.query(
      'SELECT COUNT(*) as total FROM personal_employee_info'
    )
    const totalEmployees = totalCountRows[0].total

    // Query to join both tables and retrieve necessary data
    const query = `
  SELECT pei.*, sei.*
  FROM personal_employee_info pei
  LEFT JOIN system_employee_info sei ON sei.employee_id = pei.id
`

    // Get employees' information from the database
    const [rows]: any = await connectDB.query(query, [ITEMS_PER_PAGE, offset])

    // Send the fetched data as a response along with total count
    res.status(200).json({ rows, totalEmployees })
  } catch (error: any) {
    // If an error occurs, send the error message as a response
    res.status(500).json({ error: error.message })
  }
}
