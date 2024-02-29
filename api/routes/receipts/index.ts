import { Router } from 'express'

import { getReceipts } from './getReceipts'
import { getReceiptById } from './getReceiptById'

const receipts = Router()

// Use the route handlers with router.get
receipts.get('/:page(\\d+)?', getReceipts)
receipts.get('/byId/:id', getReceiptById)

export default receipts
