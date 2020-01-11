const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('../src/models/queries.ts')
const controllers = require('../src/controllers/controller.ts')

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and postrgres API' })
})

app.post('/beaconSignal', controllers.recieveBeaconSignalsFromRpiAndAddToBeaconClass)

app.get('/beaconData', (request, response) => 
    {response.json({info: 'Get position of bleTag/trolley not implemented'})
})
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})