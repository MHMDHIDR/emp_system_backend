import { connectDB } from '../../utils/db'
import 'dotenv/config'

/**
 * Delete endpoint for customers
 * @param {*} req
 * @param {*} res
 */
export const deleteExpensesById = async (req: any, res: any) => {
  const { id: expenseId } = req.params

  // first check if the employee already exists
  const [existingUserRows]: any = await connectDB.query(
    'SELECT * FROM expenses WHERE id = ?',
    [expenseId]
  )

  if (!existingUserRows || existingUserRows.length === 0) {
    return res.status(400).json({ error: `عفواً لم يتم العثور على الإيراد` })
  }

  try {
    // Delete the client from the expenses table
    const [expensesRows]: any = await connectDB.query(
      `DELETE FROM expenses WHERE id = ?`,
      [expenseId]
    )

    if (expensesRows.affectedRows === 1) {
      res
        .status(200)
        .json({ expense_deleted: true, message: `تم حذف بيانات الإيرادات بنجاح` })
    }
  } catch (error: any) {
    console.error('Error updating employee:', error.message)
    res
      .status(500)
      .json({ expense_deleted: false, message: `حدث خطأ أثناء حذف بيانات الإيرادات` })
  }
}
