const { connectDB } = require('../../utils/db.js')
const { ITEMS_PER_PAGE } = require('../../utils/const.js')

/**
 *
 * @desc    Get All Receipts
 * @route   GET /Receipts/:page
 * @access  Private
 * @param   {object} req - Request object
 */
const getReceipts = async (req, res) => {
  const page = req.params.page || 1
  const offset = (page - 1) * ITEMS_PER_PAGE

  try {
    // Get total count of receipts
    const [totalCountRows] = await connectDB.query(
      'SELECT COUNT(*) as total FROM receipts'
    )
    const totalReceipts = totalCountRows[0].total

    // Query to retrieve necessary data from the receipts table
    const query = `
      SELECT r.*, r.id AS receipt_id, c.id AS client_id, c.client_name, pei.id AS employee_id, pei.full_name, s.service_name
      FROM receipts r
      LEFT JOIN services s ON r.service_id = s.id
      LEFT JOIN clients c ON r.client_id = c.id
      LEFT JOIN personal_employee_info pei ON r.employee_id = pei.id
      LIMIT ? OFFSET ?
    `

    // Get receipts' information from the database
    const [rows] = await connectDB.query(query, [ITEMS_PER_PAGE, offset])

    // Send the fetched data as a response along with total count
    res.status(200).json({ rows, totalReceipts })
  } catch (error) {
    // If an error occurs, send the error message as a response
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getReceipts }
