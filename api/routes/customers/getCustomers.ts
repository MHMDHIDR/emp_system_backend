import { connectDB } from '../../utils/db'
import { ITEMS_PER_PAGE } from '../../utils/const'

/**
 *
 * @desc    Get All Customers
 * @route   GET /api/customers/:page
 * @access  Public
 * @param {*} req
 * @param {*} res
 * @return  {Object} { rows, totalCustomers }
 * @return  {Object} { error }
 */
export const getCustomers = async (req: any, res: any) => {
  const page = Number(req.params.page) || 1
  const offset = (page - 1) * ITEMS_PER_PAGE

  try {
    // Get total count of customers
    const [totalCountRows]: any = await connectDB.query(
      'SELECT COUNT(*) as total FROM clients'
    )
    const totalCustomers = totalCountRows[0].total

    // Query to retrieve necessary data from the clients table
    const query = `
      SELECT id, employee_id, client_name, created_at, nationality,
             phone_number, email, job_title, office_discovery_method, customer_credentials
      FROM clients
      LIMIT ? OFFSET ?
    `

    // Get customers' information from the database
    const [rows]: any = await connectDB.query(query, [ITEMS_PER_PAGE, offset])

    // get next page number
    const nextPage = totalCustomers > page * ITEMS_PER_PAGE ? page + 1 : null

    // Send the fetched data as a response along with total count
    res.status(200).json({ rows, totalCountRows: totalCountRows[0].total, nextPage })
  } catch (error: any) {
    // If an error occurs, send the error message as a response
    res.status(500).json({ error: error.message })
  }
}
