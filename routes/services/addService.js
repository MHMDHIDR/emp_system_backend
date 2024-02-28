const { connectDB } = require('../../utils/db.js')

/**
 * @desc Add endpoint for customers
 * @param {*} req
 * @param {*} res
 */
const addService = async (req, res) => {
  const {
    employee_id,
    client_id,
    representative_id,
    service_name,
    service_total_price,
    created_at,
    ends_at,
    service_details
  } = req.body

  try {
    // Insert employee details into personal_employee_info table
    const [servicesRow] = await connectDB.query(
      `INSERT INTO services
   (employee_id, client_id, representative_id, service_name, service_total_price, created_at, ends_at, service_details)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Number(employee_id),
        Number(client_id),
        Number(representative_id),
        service_name,
        Number(service_total_price),
        new Date(created_at),
        new Date(ends_at),
        service_details
      ]
    )

    // Get the auto-generated id of the inserted employee
    const { affectedRows } = servicesRow

    if (affectedRows === 1) {
      res.status(200).json({ service_added: true, message: `تم إضافة الخدمة بنجاح` })
    }
  } catch (error) {
    console.error('Error signing up:', error.message)
    res.status(500).json({ service_added: false, message: `حدث خطأ أثناء إضافة الخدمة` })
  }
}

module.exports = { addService }
