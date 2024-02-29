import { connectDB } from '../../utils/db'
import 'dotenv/config'

/**
 * @desc Add endpoint for customers
 * @param {*} req
 * @param {*} res
 */
export const addCustomer = async (req: any, res: any) => {
  const { emp_added, name, nationality, phone, email, job, how_know, credentialsList } =
    req.body

  // check if we have the email in the database
  const [existingUserRows]: any = await connectDB.query(
    'SELECT * FROM clients WHERE email = ?',
    [email]
  )

  if (existingUserRows && existingUserRows.length > 0) {
    return res
      .status(400)
      .json({ cutomer_added: false, message: `عفواً العميل موجود مسبقاً` })
  }

  try {
    // Insert employee details into personal_employee_info table
    const [customersRow] = await connectDB.query(
      `INSERT INTO clients
        (employee_id,
         client_name,
         nationality,
         phone_number,
         email,
         job_title,
         office_discovery_method,
         customer_credentials
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        emp_added,
        name,
        nationality,
        phone,
        email,
        job,
        how_know,
        JSON.stringify(credentialsList)
      ]
    )

    // Get the auto-generated id of the inserted employee
    const { affectedRows }: any = customersRow

    if (affectedRows === 1) {
      res.status(200).json({ cutomer_added: true, message: `تم إضافة العميل بنجاح` })
    }
  } catch (error: any) {
    console.error('Error signing up:', error.message)
    res.status(500).json({ cutomer_added: false, message: `حدث خطأ أثناء إضافة العميل` })
  }
}
