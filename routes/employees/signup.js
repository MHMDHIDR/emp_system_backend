const { connectDB } = require('../../utils/db.js')
const { createHash } = require('crypto')
require('dotenv/config')

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
const signup = async (req, res) => {
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

  // first check if the username already exists
  const [existingUserRows] = await connectDB.query(
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
    const [employeeRows] = await connectDB.query(
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
    const [userRows] = await connectDB.query(
      `INSERT INTO system_employee_info (username, password, role, employee_id)
        VALUES (?, ?, ?, ?)`,
      [username, hashedPassword, role, employeeId]
    )

    if (userRows.affectedRows === 1) {
      res.status(200).json({ emp_added: true, message: `تم تسجيل الموظف بنجاح` })
    }
  } catch (error) {
    console.error('Error signing up:', error.message)
    res.status(500).json({ emp_added: false, message: `حدث خطأ أثناء تسجيل الموظف` })
  }
}

module.exports = { signup }
