const { connectDB } = require('../../utils/db.js')
const { ITEMS_PER_PAGE } = require('../../utils/const.js')

/**
 *
 * @desc    Get All Customers
 * @route   GET /api/customers/:page
 * @access  Public
 * @param {*} req
 * @param {*} res
 * @return  {Object} { rows, totalCustomers }
 * @return  {Object} { error }
 */
const getCustomers = async (req, res) => {
  const page = req.params.page || 1
  const offset = (page - 1) * ITEMS_PER_PAGE

  try {
    // Get total count of customers
    const [totalCountRows] = await connectDB.query(
      'SELECT COUNT(*) as total FROM clients'
    )
    const totalCustomers = totalCountRows[0].total

    // Query to retrieve necessary data from the clients table
    const query = `
      SELECT id, employee_id, client_name, created_at, nationality,
             phone_number, email, job_title, office_discovery_method, customer_credentials
      FROM clients
      LIMIT ? OFFSET ?
    `

    // Get customers' information from the database
    const [rows] = await connectDB.query(query, [ITEMS_PER_PAGE, offset])

    // Send the fetched data as a response along with total count
    res.status(200).json({ rows, totalCustomers })
  } catch (error) {
    // If an error occurs, send the error message as a response
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getCustomers }
