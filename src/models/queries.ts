const Pool = require('pg').Pool
const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'beaconDb',
    password: 'admin',
    port: 5432
})

const createUser = (request, response) => {
    var body = ''
    request.on('data', function(data) {
      body += data
      console.log('Partial body: ' + body)
    })
    console.log(request.body)
    /*
    const {name,email} = request.body
    pool.query('INSERT INTO test (name, email) VALUES ($1,$2)', [name,email], (error, result) => {
        if (error) {
            throw error
        }
        response.status(201).send(`added name with ID: ${result}`)
    })
    */
}

module.exports = {
    createUser
}
