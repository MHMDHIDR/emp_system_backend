const { connectDB } = require('../../utils/db.js')
require('dotenv/config')

/**
 * Delete endpoint for customers
 * @param {*} req
 * @param {*} res
 */
const deleteServiceById = async (req, res) => {
  const { id: serviceId } = req.params

  // first check if the employee already exists
  const [existingUserRows] = await connectDB.query(
    'SELECT * FROM services WHERE id = ?',
    [serviceId]
  )

  if (!existingUserRows || existingUserRows.length === 0) {
    return res.status(400).json({ error: `عفواً لم يتم العثور على الخدمة` })
  }

  try {
    // Delete the client from the services table
    const [servicesRows] = await connectDB.query(`DELETE FROM services WHERE id = ?`, [
      serviceId
    ])

    if (servicesRows.affectedRows === 1) {
      res
        .status(200)
        .json({ service_deleted: true, message: `تم حذف بيانات الخدمة بنجاح` })
    }
  } catch (error) {
    console.error('Error updating employee:', error.message)
    res
      .status(500)
      .json({ service_deleted: false, message: `حدث خطأ أثناء حذف بيانات الخدمة` })
  }
}

module.exports = { deleteServiceById }
