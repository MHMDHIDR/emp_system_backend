import { connectDB } from '../../utils/db'

/**
 * @desc Add endpoint for customers
 * @param {*} req
 * @param {*} res
 */
export const updateDetails = async (req: any, res: any) => {
  const {
    ar_office_name,
    en_office_name,
    ar_office_address,
    en_office_address,
    office_phone,
    office_email,
    office_tax_number
  } = req.body

  try {
    // Update employee details into personal_employee_info table
    const [officeDetailsRow] = await connectDB.query(
      `UPDATE office_details SET
        ar_office_name = COALESCE(?, ar_office_name),
        en_office_name = COALESCE(?, en_office_name),
        ar_office_address = COALESCE(?, ar_office_address),
        en_office_address = COALESCE(?, en_office_address),
        office_phone = COALESCE(?, office_phone),
        office_email = COALESCE(?, office_email),
        office_tax_number = COALESCE(?, office_tax_number)
      WHERE id = 1`,
      [
        ar_office_name || null,
        en_office_name || null,
        ar_office_address || null,
        en_office_address || null,
        office_phone || null,
        office_email || null,
        office_tax_number || null
      ]
    )

    // Get the auto-generated id of the inserted employee
    const { affectedRows }: any = officeDetailsRow

    if (affectedRows === 1) {
      res
        .status(200)
        .json({ is_office_details_added: true, message: `تم تحديث تفاصيل المكتب بنجاح` })
    }
  } catch (error: any) {
    console.error('Error signing up:', error.message)
    res.status(500).json({
      is_office_details_added: false,
      message: `حدث خطأ أثناء تحديث تفاصيل المكتب`
    })
  }
}
