import express from 'express'

import { updateDetails } from './updateDetails'
import { getDetails } from './getDetails'

const officeDetails = express.Router()

// Use the route handlers with router.get
officeDetails.patch('/updateDetails', updateDetails)
officeDetails.get('/:page(\\d+)?', getDetails)

export default officeDetails
