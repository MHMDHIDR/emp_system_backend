import { connectDB } from '../../utils/db'
import 'dotenv/config'

/**
 * Delete endpoint for customers
 * @param {*} req
 * @param {*} res
 */
export const deleteCustomerById = async (req: any, res: any) => {
  const { id: clientId } = req.params

  // first check if the employee already exists
  const [existingUserRows]: any = await connectDB.query(
    'SELECT * FROM clients WHERE id = ?',
    [clientId]
  )

  if (!existingUserRows || existingUserRows.length === 0) {
    return res.status(400).json({ error: `عفواً لم يتم العثور على العميل` })
  }

  try {
    // Delete the client from the clients table
    const [clientsRows]: any = await connectDB.query(`DELETE FROM clients WHERE id = ?`, [
      clientId
    ])

    if (clientsRows.affectedRows === 1) {
      res
        .status(200)
        .json({ customer_deleted: true, message: `تم حذف بيانات العميل بنجاح` })
    }
  } catch (error: any) {
    console.error('Error updating employee:', error.message)
    res
      .status(500)
      .json({ customer_deleted: false, message: `حدث خطأ أثناء حذف بيانات العميل` })
  }
}
