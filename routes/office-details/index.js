const express = require('express')

const { updateDetails } = require('./updateDetails.js')
const { getDetails } = require('./getDetails.js')

const officeDetails = express.Router()

// Use the route handlers with router.get
officeDetails.patch('/updateDetails', updateDetails)
officeDetails.get('/:page(\\d+)?', getDetails)

module.exports = officeDetails
