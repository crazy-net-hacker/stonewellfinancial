require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')

// GET all insurance_companies
router.get('/', async (req, res) => {
  try {
    console.log('insurance_companies.js get /')
    let sql = `select * from insurance_company`
    pool.query(sql, function (err, result) {
      if (!err) {
        return res.status(200).json({ data: result })
      }
      else{
        console.error(err.message)
      }
    })
  } catch (err) {
    console.error(err.message)
  }
})


module.exports = router
