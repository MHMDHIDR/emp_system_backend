const express = require('express')

const { addService } = require('./addService.js')
const { getServices } = require('./getServices.js')
const { getServiceById } = require('./getServiceById.js')
const { editServiceById } = require('./editServiceById.js')
const { deleteServiceById } = require('./deleteServiceById.js')

const services = express.Router()

// Use the route handlers with router.get
services.post('/addService', addService)
services.get('/:page(\\d+)?', getServices)
services.get('/byId/:id', getServiceById)
services.delete('/delete_service/:id', deleteServiceById)
services.patch('/editById/:id', editServiceById)

module.exports = services
