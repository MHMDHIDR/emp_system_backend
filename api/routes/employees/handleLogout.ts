import { connectDB } from '../../utils/db'
import 'dotenv/config'

/**
 * @desc Update endpoint for employees to logout
 * @param {*} req
 * @param {*} res
 */
export const handleLogout = async (req: any, res: any) => {
  const { employee_id } = req.body

  // first check if the username already exists
  const [existingUserRows]: any = await connectDB.query(
    'SELECT * FROM system_employee_info WHERE employee_id = ?',
    [employee_id]
  )

  if (!existingUserRows || existingUserRows.length === 0) {
    return res
      .status(404)
      .json({ emp_loggedOut: false, message: `لم يتم العثور على الموظف` })
  }

  try {
    // Update system_employee_info for logout_time for the last row with the employee_id
    const [userRows]: any = await connectDB.query(
      `UPDATE system_employee_info SET logout_time = NOW() WHERE employee_id = ?
        ORDER BY id DESC LIMIT 1`,
      [employee_id]
    )

    if (userRows.affectedRows === 1) {
      res.status(200).json({ emp_loggedOut: true, message: `تم تسجيل الخروج بنجاح` })
    }
  } catch (error: any) {
    console.error('Error updating employee:', error.message)
    res.status(500).json({ emp_loggedOut: false, message: `حدث خطأ أثناء تسجيل الخروج` })
  }
}
