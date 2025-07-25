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
  const currentEmpId = req.query.employeeId
  const getAll = req.query.getAll

  try {
    // Check if the employee with currentEmpId has the role 'admin'
    const [adminCheck]: any = await connectDB.query(
      'SELECT role FROM system_employee_info WHERE employee_id = ? AND role = ?',
      [currentEmpId, 'admin']
    )

    let query
    let queryParams
    // If the employee has the role 'admin', retrieve all clients and count all clients
    if (adminCheck && adminCheck.length > 0) {
      query = `
        SELECT id, employee_id, client_name, created_at, nationality,
               phone_number, email, job_title, office_discovery_method, customer_credentials
        FROM clients
        ${!getAll ? 'LIMIT ? OFFSET ?' : ''}
      `
      queryParams = [!getAll ? ITEMS_PER_PAGE : '', !getAll ? offset : '']
    } else {
      // If not 'admin', retrieve clients where client.employee_id === currentEmpId
      query = `
        SELECT id, employee_id, client_name, created_at, nationality,
               phone_number, email, job_title, office_discovery_method, customer_credentials
        FROM clients
        WHERE employee_id = ?
        ${!getAll ? 'LIMIT ? OFFSET ?' : ''}
      `
      queryParams = [currentEmpId, !getAll ? ITEMS_PER_PAGE : '', !getAll ? offset : '']
    }

    // Get total count of customers based on the employee's role
    let totalCountQuery: string
    let totalCountParams: any[]

    if (adminCheck && adminCheck.length > 0) {
      totalCountQuery = 'SELECT COUNT(*) as total FROM clients'
      totalCountParams = []
    } else {
      totalCountQuery = 'SELECT COUNT(*) as total FROM clients WHERE employee_id = ?'
      totalCountParams = [currentEmpId]
    }
    const [totalCountRows]: any = await connectDB.query(totalCountQuery, totalCountParams)
    const totalCustomers = totalCountRows[0].total

    // Get customers' information from the database based on the determined query
    const [rows]: any = await connectDB.query(query, queryParams)

    // get next page number
    const nextPage = totalCustomers > page * ITEMS_PER_PAGE ? page + 1 : null

    // Send the fetched data as a response along with total count
    res.status(200).json({ rows, totalCountRows: totalCustomers, nextPage })
  } catch (error: any) {
    // If an error occurs, send the error message as a response
    res.status(500).json({ error: error.message })
  }
}
