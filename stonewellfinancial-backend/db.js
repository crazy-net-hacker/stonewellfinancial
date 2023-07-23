require('dotenv').config()

const { Pool } = require('pg')

// const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // rejectUnauthorized: process.env.NODE_ENV === 'production',
    rejectUnauthorized: false,
  },
})

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })

// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   database: process.env.DB_DATABASE,
//   port: process.env.DB_PORT,
// })


module.exports = pool
