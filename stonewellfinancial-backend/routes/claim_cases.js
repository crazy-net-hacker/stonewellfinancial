require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')

// GET all country
router.get('/', async (req, res) => {
  try {
    // console.log('claim_cases.js get /')
    let sql = `select cc.case_type "caseType", cc.insurance_company "insuranceCompany", cc.insured_plan "insuredPlan" ,
                      cc.insured_age , cc.sickness_code "sicknessCode",
                      (select COALESCE(json_agg(
                                            json_build_object(
                                                            'language', "language" ,
                                                            'name', sickness_name
                                                          )),'[]'::json) sickness
                          from  sickness_dictionary sd 
                          where sd.sickness_code = cc.sickness_code 
                          ),
                        cc.hosipital_type "hosipitalType", cc.hosipital_city "hosipitalCity" , cc.hosipital_province "hosipitalProvince",
                        cc.treatment_cost "treatmentCost", cc.covered_amount "coveredAmount" 
                  from claim_case cc 
                  order by cc.case_type
              `
      result = await pool.query(sql)

      res.status(200).json({
        "data": result.rows,
        })

  } catch (err) {
    // console.error(err.message)
    res.send({
      "data": [],
      })
  }
})

module.exports = router