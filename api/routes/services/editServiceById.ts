import { connectDB } from '../../utils/db'

/**
 * @desc Update endpoint for customers
 *
 * @param {*} req
 * @param {*} res
 */
export const editServiceById = async (req: any, res: any) => {
  const { formData, paidAmount, subServices } = req.body
  const { id: serviceId } = req.params

  // Check if the service exists
  const [existingUserRows]: any = await connectDB.query(
    'SELECT * FROM services WHERE id = ?',
    [serviceId]
  )

  if (!existingUserRows || existingUserRows.length === 0) {
    return res.status(400).json({ error: `عفواً لم يتم العثور على الخدمة` })
  }

  try {
    // Get service details
    const [serviceDetails]: any = await connectDB.query(
      'SELECT * FROM services WHERE id = ?',
      [serviceId]
    )

    // Update service details
    const [servicesRows]: any = await connectDB.query(
      `UPDATE services
        SET
          employee_id = COALESCE(?, employee_id),
          client_id = COALESCE(?, client_id),
          representative_id = COALESCE(?, representative_id),
          service_name = COALESCE(?, service_name),
          service_total_price = COALESCE(?, service_total_price),
          service_payment_status = COALESCE(?, service_payment_status),
          service_status = COALESCE(?, service_status),
          created_at = COALESCE(?, created_at),
          ends_at = COALESCE(?, ends_at),
          service_details = COALESCE(?, service_details),
          sub_services = COALESCE(?, sub_services)
        WHERE id = ?`,
      [
        formData.employee_id ? Number(formData.employee_id) : null,
        formData.client_id ? Number(formData.client_id) : null,
        formData.representative_id ? Number(formData.representative_id) : null,
        formData.service_name ? formData.service_name : null,
        formData.service_total_price ? formData.service_total_price : null,
        formData.service_payment_status ? formData.service_payment_status : null,
        formData.service_status ? formData.service_status : null,
        formData.created_at ? formData.created_at : null,
        formData.ends_at ? formData.ends_at : null,
        formData.service_details ? formData.service_details : null,
        subServices ? JSON.stringify(subServices) : null,
        Number(serviceId)
      ]
    )

    // Get the last paid amount from the previous receipt
    const [lastReceiptRow]: any = await connectDB.query(
      `SELECT service_remaining_amount
      FROM receipts
      WHERE service_id = ?
      ORDER BY created_at DESC
      LIMIT 1`,
      [Number(serviceId)]
    )

    let remainingAmount = 0

    if (lastReceiptRow && lastReceiptRow.length > 0) {
      // If there are previous records
      const lastReceipt = lastReceiptRow[0]
      remainingAmount = lastReceipt.service_remaining_amount - Number(paidAmount)
    } else {
      // If there are no previous records
      remainingAmount = Number(serviceDetails[0].service_total_price) - Number(paidAmount)
    }

    // Ensure remaining amount is not negative
    remainingAmount = Math.max(remainingAmount, 0)

    // Add a new record into receipts table
    if (formData.service_payment_status !== 'unpaid' && paidAmount !== '') {
      const [receiptsRows]: any = await connectDB.query(
        `INSERT INTO receipts
          (service_id, client_id, employee_id, service_paid_amount, service_remaining_amount, created_at)
          VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          Number(serviceId),
          Number(existingUserRows[0].client_id),
          Number(existingUserRows[0].employee_id),
          Number(paidAmount),
          remainingAmount
        ]
      )
    }

    // Respond with success message
    res
      .status(200)
      .json({ service_updated: true, message: `تم تحديث بيانات الخدمة بنجاح` })
  } catch (error: any) {
    console.error('Error updating employee:', error)
    res
      .status(500)
      .json({ service_updated: false, message: `حدث خطأ أثناء تحديث بيانات الخدمة` })
  }
}
