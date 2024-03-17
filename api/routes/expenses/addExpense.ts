import { connectDB } from '../../utils/db'

/**
 * @desc Add endpoint for customers
 * @param {*} req
 * @param {*} res
 */
export const addExpense = async (req: any, res: any) => {
  const { amount, expense_name, description, created_at } = req.body

  try {
    // Insert employee details into personal_employee_info table
    const [expensesRow] = await connectDB.query(
      `INSERT INTO expenses
   (amount, expense_name, description, created_at)
   VALUES (?, ?, ?, ?)`,
      [Number(amount), expense_name, description, created_at]
    )

    // Get the auto-generated id of the inserted employee
    const { affectedRows }: any = expensesRow

    if (affectedRows === 1) {
      res.status(200).json({ expense_added: true, message: `تم إضافة الإيرادات بنجاح` })
    }
  } catch (error: any) {
    console.error('Error signing up:', error.message)
    res
      .status(500)
      .json({ expense_added: false, message: `حدث خطأ أثناء إضافة الإيرادات` })
  }
}
