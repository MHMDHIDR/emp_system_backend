import { connectDB } from '../../utils/db'

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
export const getCustomerById = async (req: any, res: any) => {
  const { id: customerId } = req.params

  try {
    // Validate customerId is a positive integer
    if (!/^\d+$/.test(customerId) || parseInt(customerId) < 1) {
      return res.status(400).json({ error: 'Invalid Customer ID' })
    }

    const query = `SELECT * from clients WHERE id = ?`
    const [rows]: any = await connectDB.query(query, [customerId])

    if (rows.length === 0) {
      res.status(404).json({ error: 'Customer not found' })
    } else {
      res.status(200).json(rows[0])
    }
  } catch (error: any) {
    console.error('Error fetching Customer details:', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
