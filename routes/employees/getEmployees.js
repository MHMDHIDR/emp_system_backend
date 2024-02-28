const { connectDB } = require('../../utils/db.js')
const { ITEMS_PER_PAGE } = require('../../utils/const.js')

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
const getEmployees = async (req, res) => {
  const page = req.params.page || 1
  const offset = (page - 1) * ITEMS_PER_PAGE

  try {
    // Get total count of employees
    const [totalCountRows] = await connectDB.query(
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
    const [rows] = await connectDB.query(query, [ITEMS_PER_PAGE, offset])

    // Send the fetched data as a response along with total count
    res.status(200).json({ rows, totalEmployees })
  } catch (error) {
    // If an error occurs, send the error message as a response
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getEmployees }
