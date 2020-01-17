const Pool = require('pg').Pool
const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'beaconDb',
    password: 'admin',
    port: 5432
})

const writeBleTagDataToDB = (bleTag2) => {

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
    
}
