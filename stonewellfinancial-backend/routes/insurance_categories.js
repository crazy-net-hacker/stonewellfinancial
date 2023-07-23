require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')
const crypto = require('crypto')

// GET all account(user)
router.get('/', async (req, res) => {
  try {
    console.log('insurance_categories.js get /')
    let sql = 'select * from insurance_categories'
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
