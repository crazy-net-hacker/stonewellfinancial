require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')


// GET all insuredpersons
router.get('/', async (req, res) => {
  try {
    console.log('insuredpersons.js get /')
    let sql = 'select * from insuredperson'
    pool.query(sql, function (err, result) {
      if (!err) {
        return res.status(200).json({ data: result })
      }
    })
  } catch (err) {
    console.error(err.message)
  }
})

// GET all insuredpersons who applied travel applicaion
router.get('/search/vendor_id=:vendor_id', async (req, res) => {
  try {
    // console.log('insuredpersons.js get /search/vendor_id=:vendor_id')
    // console.log('vendor', req.params.vendor_id)
    let sql = `select p.firstname "firstName" , p.lastname "lastName", to_char(p.birthdate,'YYYY-MM-DD') "birthDate", 
                      p.gender , app.email , app.phone 
                  from
                  (select ip.insured_person_id, max(ip.application_id) application_id  
                    from application a 
                    join insured_plan ip on ip.application_id  = a.application_id 
                    where a.vendor_id like '${req.params.vendor_id==='*'?'%':req.params.vendor_id}'
                    group by ip.insured_person_id 
                  ) insured 
                  join insured_person p on p.person_id = insured.insured_person_id 
                  join application app on  app.application_id = insured.application_id
                  order by 1,2,3
    `
    pool.query(sql, function (err, result) {
      if (!err) {
        res.status(200).json({ data: result.rows })
      }
      else{
        res.status(400).send({ error: 'something wrong' })
        console.error(err.message)
      }
    })
    
  } catch (err) {
    console.error(err.message)
  }
})



// Create new insuredperson
router.post('/add/source=:source', async(req, res) => {
  try {
      console.log('insuredperson.js post /add') 
      // console.log(req.params.source)
      let reqData = req.body

      // check existed insured personal information
      const sql = 'select * FROM insuredperson where firstname = $1 and lastname = $2 and birthDate = $3'
      const insuredResult = await pool.query(sql, [reqData.firstName, reqData.lastName, reqData.birthDate ])
      if (insuredResult.rowCount !== 0) {     
          console.log(insuredResult.rows[0].person_id)
          res.status(200).json({ insuredperson: insuredResult.rows[0].person_id })
        } 
      // add if not existed insured
    //   else 
    //   {
    //     let sql = `insert into insuredperson (firstname, lastname, gender, birthDate,
    //                 phone, email, sourceby ) 
    //       values ('${reqData.firstName}', '${reqData.lastName}', '${reqData.gender}', '${reqData.birthDate}', 
    //               '${reqData.phoneNum}', '${reqData.emailAdd}', '${req.params.source}') returning person_id `
    //     // console.log(sql)
    //     await pool.query(sql)
    //     .then((result) => {
    //           console.log('Insured(person) has been added successfully' )
    //           console.log(result.rows[0].person_id)
    //           res.status(200).json({ insuredperson: result.rows[0].person_id })
    //     }).catch((err) => {
    //           res.json({
    //             data: err.message
    //             })
    //         })
    //  }

    } catch (err) {
      console.error(err.message)
  }
})



module.exports = router

