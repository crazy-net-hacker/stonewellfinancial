require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')


router.get('/report/fr=:fr&to=:to&vendor_id=:vendor_id', async(req, res) => {
  try {
    let sql = `select s.sales_date , v.vendor_name, 
                      i.sales_type , i.premium_amount , i.refund_amount , i.rebate , i.invoice_document, 
                      c.sales_type , c.premium_amount "carewell_service_amount", c.refund_amount "carewell_refund", c.rebate "carewell_rebate", c.invoice_document "carewell_invoice_document"
                  from (select sales_date , vendor_id
                        from sales_statement
                        group by sales_date,vendor_id ) s
                  left join (select sales_date , vendor_id , sales_type , premium_amount , refund_amount , rebate , invoice_document 
                              from sales_statement 
                              where sales_type  = 'I') i on i.sales_date = s.sales_date and i.vendor_id = s.vendor_id
                  left join (select sales_date , vendor_id , sales_type , premium_amount , refund_amount , rebate , invoice_document 
                              from sales_statement 
                              where sales_type  = 'C') c on c.sales_date = s.sales_date and c.vendor_id = s.vendor_id
                  join vendor v on v.vendor_id = s.vendor_id
                  where s.vendor_id like '${req.params.vendor_id==='*'?'%':req.params.vendor_id}'
                  and s.sales_date between '${req.params.fr}' and '${req.params.to}'
                  order by 2,1
    `
    pool.query(sql, function (err, result) {
      if (!err) {
        res.status(200).json({ data: result.rows })
      }
      else{
        res.status(200).json({
          "status": "error",
          "message": "Something went wrong"                
        })
        // console.error(err.message)
      }
    })

  } catch (err) {
    console.error(err.message)
    res.status(200).json({
      "status": "error",
      "message": "Something went wrong"                
    })
  }
})

module.exports = router
