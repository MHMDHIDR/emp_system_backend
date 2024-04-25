import { connectDB } from '../../utils/db'

/**
 *
 * @desc    Get Customer details by id for comparison
 * @route   GET /api/searchCustomer/:query
 * @access  Public
 * @param {*} req
 * @param {*} res
 * @return  {Object} { rows }
 * @return  {Object} { error }
 */
export const searchCustomer = async (req: any, res: any) => {
  const { query: clientName } = req.params

  try {
    const query = `SELECT * from clients WHERE client_name LIKE ?` // Use 'LIKE' for partial matching
    const [rows]: any = await connectDB.query(query, [`%${clientName}%`]) // Use `%` for wildcard search

    if (rows.length === 0) {
      res.status(404).json({ error: 'Customer not found' })
    } else {
      res.status(200).json(rows)
    }
  } catch (error: any) {
    console.error('Error fetching Customer details:', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
