import { connectDB } from '../../utils/db'

/**
 *
 * @desc    Get employee details by id for comparison
 * @route   GET /api/employees/:id
 * @access  Public
 * @param {*} req
 * @param {*} res
 * @return  {Object} { rows }
 * @return  {Object} { error }
 */
export const getEmployeeById = async (req: any, res: any) => {
  const { id: employeeId } = req.params

  try {
    // Validate employeeId is a positive integer
    if (!/^\d+$/.test(employeeId) || parseInt(employeeId) < 1) {
      return res.status(400).json({ error: 'Invalid employee ID' })
    }

    const query = `
      SELECT sei.id AS employee_id, sei.username, sei.role, sei.login_time, sei.logout_time,
             pei.full_name, pei.nationality, pei.start_working_date, pei.final_working_date,
             pei.contract_end_date, pei.residency_end_date, pei.personal_id_number,
             pei.passport_id_number, pei.salary_amount, pei.comission_percentage
      FROM system_employee_info sei
      LEFT JOIN personal_employee_info pei ON sei.employee_id = pei.id
      WHERE sei.employee_id = ?`

    const [rows]: any = await connectDB.query(query, [employeeId])

    if (rows.length === 0) {
      res.status(404).json({ error: 'Employee not found' })
    } else {
      res.status(200).json(rows[0])
    }
  } catch (error: any) {
    console.error('Error fetching employee details:', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
