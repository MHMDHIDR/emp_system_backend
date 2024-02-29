import { Router } from 'express'

import { addService } from './addService'
import { getServices } from './getServices'
import { getServiceById } from './getServiceById'
import { editServiceById } from './editServiceById'
import { deleteServiceById } from './deleteServiceById'

const services = Router()

// Use the route handlers with router.get
services.post('/addService', addService)
services.get('/:page(\\d+)?', getServices)
services.get('/byId/:id', getServiceById)
services.delete('/delete_service/:id', deleteServiceById)
services.patch('/editById/:id', editServiceById)

export default services
