import 'dotenv/config'
import { Request, Response } from 'express'
import { connectDB } from '../../utils/db'
import { createHash } from 'crypto'
import 'dotenv/config'

/**
 * @desc Login endpoint for employees
 * @param {*} req
 * @param {*} res
 */
interface User {
  employee_id: number
  username: string
  password: string
  role: string
  full_name: string
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body
  // make sure the hashed password is the same as the one in the database
  const hashedPassword: string = createHash('sha256')
    .update(password + process.env.SALT)
    .digest('hex')

  try {
    const [user]: any = (
      await connectDB.query(
        'SELECT * FROM system_employee_info JOIN personal_employee_info ON system_employee_info.employee_id = personal_employee_info.id WHERE username = ? AND password = ?',
        [username, hashedPassword]
      )
    )[0]

    if (user) {
      //Insert new Row to system_employee_info set user.employee_id and add login time
      await connectDB.query(
        `INSERT INTO system_employee_info (employee_id, username, password, role, login_time)
        VALUES (?, ?, ?, ?, NOW())`,
        [user.employee_id, user.username, user.password, user.role]
      )

      res.status(200).json({
        id: user.employee_id,
        role: user.role,
        full_name: user.full_name,
        login: true,
        message: `تم تسجيل الدخول بنجاح ${user.full_name} جاري تحويلك...`
      })
    } else {
      res
        .status(401)
        .json({ login: false, message: `اسم المستخدم أو كلمة المرور غير صحيحة` })
    }
  } catch (error: any) {
    console.error('Error logging in:', error.message)
    res.status(500).json({ login: false, message: `حدث خطأ أثناء تسجيل الدخول` })
  }
}
