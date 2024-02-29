import { connectDB } from '../../utils/db'
import 'dotenv/config'

/**
 * @desc Update endpoint for customers
 *
 * @param {*} req
 * @param {*} res
 */
export const editCustomerById = async (req: any, res: any) => {
  const { employee_id, name, nationality, phone, email, job, credentials, howKnow } =
    req.body
  const { id: customerId } = req.params

  // first check if the username already exists
  const [existingUserRows]: any = await connectDB.query(
    'SELECT * FROM clients WHERE id = ?',
    [customerId]
  )

  if (!existingUserRows || existingUserRows.length === 0) {
    return res.status(400).json({ error: `عفواً لم يتم العثور على العميل` })
  }

  try {
    // Update employee details in personal_employee_info table
    const [customerRows]: any = await connectDB.query(
      `UPDATE clients
        SET
          employee_id = COALESCE(?, employee_id),
          client_name = COALESCE(?, client_name),
          nationality = COALESCE(?, nationality),
          phone_number = COALESCE(?, phone_number),
          email = COALESCE(?, email),
          job_title = COALESCE(?, job_title),
          customer_credentials = COALESCE(?, customer_credentials),
          office_discovery_method = COALESCE(?, office_discovery_method)
        WHERE id = ?`,
      [
        employee_id,
        name || null,
        nationality || null,
        phone || null,
        email || null,
        job || null,
        JSON.stringify(credentials) || null,
        howKnow || null,
        customerId
      ]
    )

    if (customerRows.affectedRows === 1) {
      res
        .status(200)
        .json({ customer_updated: true, message: `تم تحديث بيانات العميل بنجاح` })
    }
  } catch (error: any) {
    console.error('Error updating employee:', error.message)
    res
      .status(500)
      .json({ customer_updated: false, message: `حدث خطأ أثناء تحديث بيانات العميل` })
  }
}
