require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')

// GET all travel
router.get('/', async (req, res) => {
  try {
    console.log('travel_quotes.js get /')
    let sql = `select * from travel_quote`
    pool.query(sql, function (err, result) {
      if (!err) {
        return res.status(200).json({ data: result })
      }
    })
  } catch (err) {
    console.error(err.message)
  }
})




module.exports = router
