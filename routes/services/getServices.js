const { connectDB } = require('../../utils/db.js')
const { ITEMS_PER_PAGE } = require('../../utils/const.js')

/**
 *
 * @desc    Get All Services
 * @route   GET /services/:page
 * @access  Private
 * @param   {object} req - Request object
 */
const getServices = async (req, res) => {
  const page = req.params.page || 1
  const offset = (page - 1) * ITEMS_PER_PAGE

  try {
    // Get total count of customers
    const [totalCountRows] = await connectDB.query(
      'SELECT COUNT(*) as total FROM services'
    )
    const totalServices = totalCountRows[0].total

    // Query to retrieve necessary data from the services table
    const query = `SELECT * FROM services LIMIT ? OFFSET ?`

    // Get customers' information from the database
    const [rows] = await connectDB.query(query, [ITEMS_PER_PAGE, offset])

    // Send the fetched data as a response along with total count
    res.status(200).json({ rows, totalServices })
  } catch (error) {
    // If an error occurs, send the error message as a response
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getServices }
