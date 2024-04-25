import { connectDB } from '../../utils/db'

/**
 *
 * @desc    Get Service details by id for comparison
 * @route   GET /api/employees/:id
 * @access  Public
 * @param {*} req
 * @param {*} res
 * @return  {Object} { rows }
 * @return  {Object} { error }
 */
export const getServiceById = async (req: any, res: any) => {
  const { id: customerId } = req.params
  // get serviceId from query params
  const { serviceId } = req.query

  try {
    // Validate customerId is a positive integer
    if (!customerId && (!/^\d+$/.test(customerId) || parseInt(customerId) < 0)) {
      return res.status(400).json({ error: 'Invalid Service ID' })
    } else if (customerId && (!/^\d+$/.test(customerId) || parseInt(customerId) < 0)) {
      return res.status(400).json({ error: 'Invalid Customer ID' })
    }

    // Get total count of customers
    const countQuery = parseInt(customerId)
      ? `SELECT COUNT(*) as total FROM services WHERE id = ?`
      : parseInt(customerId)
      ? `SELECT COUNT(*) as total FROM services WHERE client_id = ?`
      : parseInt(serviceId) && parseInt(customerId) === 0
      ? `SELECT COUNT(*) as total FROM services WHERE id = ?`
      : `SELECT COUNT(*) as total FROM services`
    const query = parseInt(customerId)
      ? `SELECT * from services WHERE client_id = ?`
      : parseInt(serviceId) && parseInt(customerId) === 0
      ? `SELECT * from services WHERE id = ?`
      : `SELECT * from services`

    console.log('query ->', query)

    const [rows]: any = await connectDB.query(query, [
      parseInt(customerId)
        ? parseInt(customerId)
        : parseInt(serviceId)
        ? parseInt(serviceId)
        : parseInt(customerId)
    ])
    const [totalCountRows]: any = await connectDB.query(countQuery, [
      parseInt(customerId) ? parseInt(customerId) : parseInt(customerId)
    ])
    const totalServices = totalCountRows[0].total

    if (rows.length === 0) {
      res.status(404).json({ error: 'Service not found' })
    } else {
      res.status(200).json({ rows: customerId ? rows : rows[0], totalServices })
    }
  } catch (error: any) {
    console.error('Error fetching Service details:', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
