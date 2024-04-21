import { connectDB } from '../../utils/db'

/**
 * @desc Delete endpoint for employees
 * @param {*} req
 * @param {*} res
 */
export const deleteEmployeeById = async (req: any, res: any) => {
  const { id: employeeId } = req.params

  // first check if the employee already exists
  const [existingUserRows]: any = await connectDB.query(
    'SELECT * FROM system_employee_info WHERE employee_id = ?',
    [employeeId]
  )

  if (!existingUserRows || existingUserRows.length === 0) {
    return res.status(400).json({ error: `عفواً لم يتم العثور على الموظف` })
  }

  try {
    // Delete the employee from the system_employee_info table and from personal_employee_info table
    const [employeeRows]: any = await connectDB.query(
      `DELETE FROM system_employee_info WHERE employee_id = ?`,
      [employeeId]
    )

    const [personalRows]: any = await connectDB.query(
      `DELETE FROM personal_employee_info WHERE id = ?`,
      [employeeId]
    )

    if (employeeRows.affectedRows === 1 && personalRows.affectedRows === 1) {
      res.status(200).json({ emp_deleted: true, message: `تم حذف بيانات الموظف بنجاح` })
    }
  } catch (error: any) {
    console.error('Error deleting employee:', error.message)

    if (error.sqlMessage && error.sqlMessage.includes('foreign key constraint')) {
      // If the error is due to a foreign key constraint violation
      res.status(400).json({
        emp_deleted: false,
        message:
          'لا يمكن حذف الموظف لأنه مرتبط ببيانات عملاء وخدمات، يرجى حذف العملاء والخدمات المرتبطة به أولاً'
      })
    } else {
      // If it's a general error
      res
        .status(500)
        .json({ emp_deleted: false, message: `حدث خطأ أثناء حذف بيانات الموظف` })
    }
  }
}
