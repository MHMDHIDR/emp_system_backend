/**
 * A custom logger middleware to log the request
 * It loggs the request method, url, body and the date
 *
 * @param {*} format
 * @returns {Function} next
 */
const logger = format => (req, _res, next) => {
  const { method, url, body } = req
  const dateCommon = new Date().toISOString()
  const dateLocal = new Date(dateCommon).toLocaleDateString()

  const log = `------------------------
    Request: ${method}
    From: ${url}
    AT: ${format === 'common' ? dateCommon : format === 'local' ? dateLocal : new Date()}
    ${format === 'full' ? (body?.length ? `Body: ${JSON.stringify(body)}` : '') : ''}
------------------------`

  // Log the request
  console.log(log)
  next()
}

module.exports = logger
