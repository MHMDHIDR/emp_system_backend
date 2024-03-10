import { connectDB } from '../../utils/db'

/**
 * @desc Update endpoint for customers
 *
 * @param {*} req
 * @param {*} res
 */
export const editServiceById = async (req: any, res: any) => {
  const formData = req.body
  const { id: serviceId } = req.params

  // first check if the username already exists
  const [existingUserRows]: any = await connectDB.query(
    'SELECT * FROM services WHERE id = ?',
    [serviceId]
  )

  if (!existingUserRows || existingUserRows.length === 0) {
    return res.status(400).json({ error: `عفواً لم يتم العثور على الخدمة` })
  }

  console.log('formData -->', formData)
  console.log('formData.service_details -->', formData.service_details)

  const endsAtDate = new Date(formData.ends_at)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ')

  try {
    // Update employee details in personal_employee_info table
    const [servicesRows]: any = await connectDB.query(
      `UPDATE services
        SET
          employee_id = COALESCE(?, employee_id),
          client_id = COALESCE(?, client_id),
          representative_id = COALESCE(?, representative_id),
          service_name = COALESCE(?, service_name),
          service_total_price = COALESCE(?, service_total_price),
          service_payment_status = COALESCE(?, service_payment_status),
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
        formData.created_at ? formData.created_at : null,
        endsAtDate ?? null,
        formData.service_details ? formData.service_details : null,
        // formData.subServices.length > 1 ? formData.subServices : null,
        formData.subServices ? JSON.stringify(formData.subServices) : null,
        Number(serviceId)
      ]
    )

    // add a new record into receipts table and set service_paid_amount and id ,client_id ,service_id ,employee_id ,created_at
    if (formData.service_payment_status !== 'unpaid') {
      const [receiptsRows]: any = await connectDB.query(
        `INSERT INTO receipts
          (service_id, client_id, employee_id, service_paid_amount, created_at)
          VALUES (?, ?, ?, ?, NOW())`,
        [
          Number(serviceId),
          Number(existingUserRows[0].client_id),
          Number(existingUserRows[0].employee_id),
          Number(formData.service_paid_amount)
        ]
      )
    }

    // return response
    // if (servicesRows.affectedRows === 1) {
    res
      .status(200)
      .json({ service_updated: true, message: `تم تحديث بيانات الخدمة بنجاح` })
    // }
  } catch (error: any) {
    console.error('Error updating employee:', error)
    res
      .status(500)
      .json({ service_updated: false, message: `حدث خطأ أثناء تحديث بيانات الخدمة` })
  }
}
