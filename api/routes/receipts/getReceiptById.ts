import { connectDB } from '../../utils/db'

/**
 *
 * @desc    Get Receipts details by id for comparison
 * @route   GET /api/employees/:id
 * @access  Public
 * @param {*} req
 * @param {*} res
 * @return  {Object} { rows } Array of Receipts details
 * @return  {Object} { error }
 */
export const getReceiptById = async (req: any, res: any) => {
  const { id: serviceId } = req.params
  const { customerId } = req.query

  try {
    // Validate serviceId is a positive integer
    if (!customerId && (!/^\d+$/.test(serviceId) || parseInt(serviceId) < 1)) {
      return res.status(400).json({ error: 'Invalid Receipts ID' })
    } else if (customerId && (!/^\d+$/.test(customerId) || parseInt(customerId) < 1)) {
      return res.status(400).json({ error: 'Invalid Customer ID' })
    }

    // JOIN receipts with services, clients, and personal_employee_info to get service, client, and employee details
    const query = parseInt(serviceId)
      ? `SELECT r.*, r.id AS receipt_id, c.id, c.client_name, pei.id, pei.full_name, s.service_name, s.service_total_price
        FROM receipts r
        LEFT JOIN services s ON r.service_id = s.id
        LEFT JOIN clients c ON r.client_id = c.id
        LEFT JOIN personal_employee_info pei ON r.employee_id = pei.id
        WHERE r.service_id = ?`
      : parseInt(customerId)
      ? `SELECT r.*, r.id AS receipt_id, c.id, c.client_name, pei.id, pei.full_name, s.service_name, s.service_total_price
        FROM receipts r
        LEFT JOIN services s ON r.service_id = s.id
        LEFT JOIN clients c ON r.client_id = c.id
        LEFT JOIN personal_employee_info pei ON r.employee_id = pei.id
        WHERE r.client_id = ?`
      : `SELECT r.*, r.id AS receipt_id, c.id, c.client_name, pei.id, pei.full_name, s.service_name, s.service_total_price
        FROM receipts r
        LEFT JOIN services s ON r.service_id = s.id
        LEFT JOIN clients c ON r.client_id = c.id
        LEFT JOIN personal_employee_info pei ON r.employee_id = pei.id`

    // Execute the modified query
    const [rows]: any = await connectDB.query(query, [
      parseInt(serviceId) || parseInt(customerId) // Use either serviceId or customerId based on the condition
    ])

    if (rows.length === 0) {
      res.status(200).json([])
    } else {
      res.status(200).json(rows)
    }
  } catch (error: any) {
    console.error('Error fetching Receipts details:', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
