require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')

// GET all country
router.get('/country', async (req, res) => {
  try {
    // console.log('countires.js get /country')
    let sql = `select country_code, name from country order by sort, name `
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


// GET all province
router.get('/province', async (req, res) => {
  try {
    // console.log('countires.js get /province')
    let sql = `select country_code, province_code, province_name from province`
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
