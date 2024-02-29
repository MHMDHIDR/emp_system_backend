import 'dotenv/config'
import { Request, Response } from 'express'
import { connectDB } from '../../utils/db'
import { createHash } from 'crypto'
import 'dotenv/config'

/**
 * @desc Signup endpoint for employees that takes:
 * username (unique)
 * password (hashed)
 * full_name 
 * nationality
 * start_working_date
 * final_working_date
 * contract_end_date
 * residency_end_date
 * personal_id_number
 * passport_id_number
 * salary_amount

 * @param {*} req
 * @param {*} res
 */
interface EmployeeRequestBody {
  username: string
  password: string
  role: string
  fullName: string
  nationality: string
  startWorkingDate: string
  finalWorkingDate: string
  contractEndDate: string
  residencyEndDate: string
  personalIdNumber: string
  passportIdNumber: string
  salaryAmount: number
  comissionPercentage: number
}

export const signup = async (req: Request, res: Response) => {
  const {
    username,
    password,
    role,
    fullName,
    nationality,
    startWorkingDate,
    finalWorkingDate,
    contractEndDate,
    residencyEndDate,
    personalIdNumber,
    passportIdNumber,
    salaryAmount,
    comissionPercentage
  }: EmployeeRequestBody = req.body

  // first check if the username already exists
  const [existingUserRows]: any = await connectDB.query(
    'SELECT * FROM system_employee_info WHERE username = ?',
    [username]
  )

  if (existingUserRows.length > 0) {
    return res.status(400).json({ error: `اسم المستخدم موجود بالفعل` })
  }

  // hash the password
  const hashedPassword = createHash('sha256')
    .update(password + process.env.SALT)
    .digest('hex')

  try {
    // Insert employee details into personal_employee_info table
    const [employeeRows]: any = await connectDB.query(
      `INSERT INTO personal_employee_info
        (full_name,
         nationality,
         start_working_date,
         final_working_date,
         contract_end_date,
         residency_end_date,
         personal_id_number,
         passport_id_number,
         salary_amount,
         comission_percentage
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullName,
        nationality,
        startWorkingDate,
        finalWorkingDate,
        contractEndDate,
        residencyEndDate,
        personalIdNumber,
        passportIdNumber,
        salaryAmount,
        comissionPercentage
      ]
    )

    // Get the auto-generated id of the inserted employee
    const employeeId = employeeRows.insertId

    // Insert employee details into system_employee_info table along with the generated employeeId
    const [userRows]: any = await connectDB.query(
      `INSERT INTO system_employee_info (username, password, role, employee_id)
        VALUES (?, ?, ?, ?)`,
      [username, hashedPassword, role, employeeId]
    )

    if (userRows.affectedRows === 1) {
      res.status(200).json({ emp_added: true, message: `تم تسجيل الموظف بنجاح` })
    }
  } catch (error: any) {
    console.error('Error signing up:', error.message)
    res.status(500).json({ emp_added: false, message: `حدث خطأ أثناء تسجيل الموظف` })
  }
}
