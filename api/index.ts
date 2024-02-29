const express = require('express')
const app = express()

app.get('/', (req: any, res: { send: (arg0: string) => any }) =>
  res.send('Express on Vercel')
)

// endpoint to test the server
app.get('/test', (req: any, res: { send: (arg0: string) => any }) =>
  res.send('Server is working')
)

app.listen(3000, () => console.log('Server ready on port http://localhost:3000'))

module.exports = app
