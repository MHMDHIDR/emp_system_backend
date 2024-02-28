const { connectDB } = require('../../utils/db.js')

/**
 *
 * @desc    Get Customer details by id for comparison
 * @route   GET /api/employees/:id
 * @access  Public
 * @param {*} req
 * @param {*} res
 * @return  {Object} { rows }
 * @return  {Object} { error }
 */
const getCustomerById = async (req, res) => {
  const { id: customerId } = req.params

  try {
    // Validate customerId is a positive integer
    if (!/^\d+$/.test(customerId) || parseInt(customerId) < 1) {
      return res.status(400).json({ error: 'Invalid Customer ID' })
    }

    const query = `SELECT * from clients WHERE id = ?`
    const [rows] = await connectDB.query(query, [customerId])

    if (rows.length === 0) {
      res.status(404).json({ error: 'Customer not found' })
    } else {
      res.status(200).json(rows[0])
    }
  } catch (error) {
    console.error('Error fetching Customer details:', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = { getCustomerById }
