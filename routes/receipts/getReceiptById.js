const { connectDB } = require('../../utils/db.js')

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
const getReceiptById = async (req, res) => {
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
      ? `SELECT r.*, r.id AS receipt_id, c.id, c.client_name, pei.id, pei.full_name, s.service_name
        FROM receipts r
        LEFT JOIN services s ON r.service_id = s.id
        LEFT JOIN clients c ON r.client_id = c.id
        LEFT JOIN personal_employee_info pei ON r.employee_id = pei.id
        WHERE r.service_id = ?`
      : parseInt(customerId)
      ? `SELECT r.*, r.id AS receipt_id, c.id, c.client_name, pei.id, pei.full_name, s.service_name
        FROM receipts r
        LEFT JOIN services s ON r.service_id = s.id
        LEFT JOIN clients c ON r.client_id = c.id
        LEFT JOIN personal_employee_info pei ON r.employee_id = pei.id
        WHERE r.client_id = ?`
      : `SELECT r.*, r.id AS receipt_id, c.id, c.client_name, pei.id, pei.full_name, s.service_name
        FROM receipts r
        LEFT JOIN services s ON r.service_id = s.id
        LEFT JOIN clients c ON r.client_id = c.id
        LEFT JOIN personal_employee_info pei ON r.employee_id = pei.id`

    // Execute the modified query
    const [rows] = await connectDB.query(query, [
      parseInt(serviceId) || parseInt(customerId) // Use either serviceId or customerId based on the condition
    ])

    console.log('rows -->', rows)

    if (rows.length === 0) {
      res.status(404).json({ error: 'Receipts not found' })
    } else {
      res.status(200).json(rows)
    }
  } catch (error) {
    console.error('Error fetching Receipts details:', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = { getReceiptById }
