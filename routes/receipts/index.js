const express = require('express')

const { getReceipts } = require('./getReceipts.js')
const { getReceiptById } = require('./getReceiptById.js')

const receipts = express.Router()

// Use the route handlers with router.get
receipts.get('/:page(\\d+)?', getReceipts)
receipts.get('/byId/:id', getReceiptById)

module.exports = receipts
