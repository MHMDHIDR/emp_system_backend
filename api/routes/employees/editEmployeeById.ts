import { connectDB } from '../../utils/db'
import { createHash } from 'crypto'
import 'dotenv/config'

/**
 * @desc Update endpoint for employees that takes:
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
 * comission_percentage
 * @param {*} req
 * @param {*} res
 */
export const editEmployeeById = async (req: any, res: any) => {
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
  } = req.body

  const { id: employeeId } = req.params

  // first check if the username already exists
  const [existingUserRows]: any = await connectDB.query(
    'SELECT * FROM system_employee_info WHERE employee_id = ?',
    [employeeId]
  )

  if (!existingUserRows || existingUserRows.length === 0) {
    return res.status(400).json({ error: `عفواً لم يتم العثور على الموظف` })
  }

  // hash the password
  const hashedPassword = createHash('sha256')
    .update(password + process.env.SALT)
    .digest('hex')

  try {
    // Update employee details in personal_employee_info table
    const [employeeRows]: any = await connectDB.query(
      `UPDATE personal_employee_info
        SET 
          full_name = COALESCE(?, full_name),
          nationality = COALESCE(?, nationality),
          start_working_date = COALESCE(?, start_working_date),
          final_working_date = COALESCE(?, final_working_date),
          contract_end_date = COALESCE(?, contract_end_date),
          residency_end_date = COALESCE(?, residency_end_date),
          personal_id_number = COALESCE(?, personal_id_number),
          passport_id_number = COALESCE(?, passport_id_number),
          salary_amount = COALESCE(?, salary_amount),
          comission_percentage = COALESCE(?, comission_percentage)
        WHERE id = ?`,
      [
        fullName || null,
        nationality || null,
        startWorkingDate || null,
        finalWorkingDate || null,
        contractEndDate || null,
        residencyEndDate || null,
        personalIdNumber || null,
        passportIdNumber || null,
        salaryAmount || null,
        comissionPercentage || null,
        employeeId
      ]
    )

    // Update system_employee_info for username, password, and role
    const [userRows]: any = await connectDB.query(
      `UPDATE system_employee_info
        SET 
          username = COALESCE(?, username),
          password = COALESCE(?, password),
          role = COALESCE(?, role)
        WHERE employee_id = ?`,
      [username || null, hashedPassword || null, role || null, employeeId]
    )

    // if (userRows.affectedRows === 1 && employeeRows.affectedRows === 1) {
    //   res.status(200).json({ emp_updated: true, message: `تم تحديث بيانات الموظف بنجاح` })
    // }
    res.status(200).json({ emp_updated: true, message: `تم تحديث بيانات الموظف بنجاح` })
  } catch (error: any) {
    console.error('Error updating employee:', error.message)
    res
      .status(500)
      .json({ emp_updated: false, message: `حدث خطأ أثناء تحديث بيانات الموظف` })
  }
}
