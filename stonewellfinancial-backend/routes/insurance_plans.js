require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')

// GET all plan
router.get('/plan', async (req, res) => {
  try {
        // console.log('travel_quotes.js get /plan')
        let sql = `select p.insured_type, p.company_name, p.product_id ,pp.plan_id, p.generic_name,  p.generic_name_kr , 
                          p.primary_coverage_type,  p.trip_type, 
                          pp.price_code :: Integer price_code, pp.rate, 
                          pp.value_min "min_age", pp.value_max "max_age", 
                          pp.period_code, pv.value_min "min_period", pv.value_max "max_period",pp.calculate_rate, pp.value "premium_rate",
                          type_deduct, is_deleted,
                          (select COALESCE(json_agg(
                                              json_build_object(
                                                  'created_at', pph.created_at,
                                                  'premium_rate', pph.value,
                                                  'calculate_rate', pph.calculate_rate
                                                )),'[]'::json) history
                            from plan_price_history pph 
                            where pph.plan_id = pp.plan_id
                              and pph.price_code = pp.price_code 
                              and pph.period_code = pp.period_code
                              and pph.value_min = pp.value_min
                              and pph.value_max = pp.value_max
                          )
                    from plan_price pp 
                    join plan_value pv on pv.price_code = pp.period_code
                    join (select pl.insured_type , pl.plan_id, pl.generic_name, pl.generic_name_kr,  
                                  pl.primary_coverage_type, pl.trip_type, pl.product_id , pd.company_name,
                                  (select 
                                    COALESCE(json_agg(
                                                  json_build_object(
                                                      'input_code', i.input_code ,          
                                                      'price_code', v.price_code ,
                                                      'lable', v.lable ,
                                                      'value', v.value ,
                                                      'discount', v.discount,
                                                      'default', v.default 
                                                    )),'[]') type_deduct
                                                    from plan_value v
                                              join plan_input i on i.input_code = v.input_code and i.input_type = 'DED'  and i.input_code = pl.deduct_code
                                                    ), 
                                  pl.is_deleted
                            from plan pl 
                            join (select ic.name company_name, product.product_id 
                                    from product
                                    join insurance_company ic on ic.company_id = product.company_id ) pd on pd.product_id = pl.product_id) p on p.plan_id = pp.plan_id --and p.primary_coverage_type = 'MED'
                    order by p.insured_type, p.insured_type,p.product_id, pp.plan_id, pp.price_code :: Integer, pp.rate, pp.value_min, pv.value_min
                    `
        pool.query(sql, function (err, result) {
          if (!err) {
            return res.status(200).json({ data: result })
          }
        })
  } catch (err) {
    console.error(err.message)
  }
})

// update all plan
router.put('/update/plan', async (req, res) => {
  try {
    // console.log('travel_quotes.js put /update')
    const data = req.body;


    var updatedCount = 0;
    // udpate 
    for (const i in data) {
      if(parseFloat(data[i].premium_rate) !== parseFloat(data[i].updated_premium)){

        updatedCount += 1;

        const sql = `update plan_price 
                      set value = $1
                    where plan_id = '${data[i].plan_id}'
                      and price_code = '${data[i].price_code}'
                      and period_code = '${data[i].period_code}'
                      and rate = '${data[i].rate}'
                      and value_min = '${data[i].min_age}'
                      and value_max = '${data[i].max_age}'  returning *`
        const reqData = [data[i].updated_premium]
        await pool.query(sql, reqData)

      }
    }  //end  for (const i in data)


    res.send({status: 'success', message: `${updatedCount} data ${updatedCount===1?'has':'have'} been updateded successfully.`})

  } catch (err) {
    console.log('Error  : ', err.message )
    res.send({status: 'error', message: 'Something went wrong'})
  }
})

// GET all insurace
router.get('/insurance', async (req, res) => {
  try {
    // console.log('travel_quotes.js get /insurance')
    let sql = `select  pp.period_code, P3.compnay_name,
                        p.product_id, p.plan_id, p.generic_name, p.generic_name_kr, p.insured_type, p.trip_type, p.trip_via_usa, p.primary_coverage_type coverage_type,
                        pp.price_code, pp.period_code, pp.default coverage_default,  pv.trip_length_min, pv.trip_length_max, pv.discount, pv.calculate_discount,
                        pp.value_min age_min, pp.value_max age_max, pp.value, pp.rate value_rate, pp.calculate_rate, null multi_trip_rate,
                        (select 
                          COALESCE(json_agg(
                                       json_build_object(
                                           'rate', rate ,          
                                           'value_min', value_min ,
                                           'value_max', value_max ,
                                           'period_code', period_code,
                                           'value', value ,
                                           'calculate_rate', calculate_rate
                                         )),'[]') rate
                                         from plan_price 
                                         where plan_id = pp.plan_id 
                                          and price_code = pp.price_code 
                                          and value_min = pp.value_min
                                          and value_max = pp.value_max
                                         ) ,
                        (select 
                          COALESCE(json_agg(
                                       json_build_object(
                                           'input_code', i.input_code ,          
                                           'price_code', v.price_code ,
                                           'lable', v.lable ,
                                           'value', v.value ,
                                           'discount', v.discount,
                                           'default', v.default 
                                         )),'[]') type_deduct
                                         from plan_value v
                                   join plan_input i on i.input_code = v.input_code and i.input_type = 'DED'  and i.input_code = p.deduct_code
                                         ),
                          null deduct ,
                        (select 
                            COALESCE(json_agg(
                                          json_build_object(
                                              'document_type', document_type ,          
                                              'language', language ,
                                              'document_url', document_url
                                            )),'[]') documents
                                            from plan_document
                                            where plan_id = p.plan_id 
                                            )      
                    from plan p
                    join plan_price pp on p.plan_id = pp.plan_id and pp.rate = '1'
                    join product p2 on p.product_id = p2.product_id
                    join (select p.product_id , ic.name compnay_name, p.name product_name
                            from product p
                            join insurance_company ic on p.company_id  = ic.company_id ) p3 on p.product_id  = p3.product_id
                    join (select price_code, value_min trip_length_min, value_max trip_length_max, discount, calculate_discount
                            from plan_value v
                            join plan_input i on i.input_code = v.input_code )  pv on pv.price_code = pp.period_code
                            where p.is_deleted = false
                        `    
    pool.query(sql, function (err, result) {
      if (!err) {
        return res.status(200).json({ data: result })
      }
    })
  } catch (err) {
    console.error(err.message)
  }
})



// GET all insurace by type of insurance
router.get('/insurance/type=:type', async (req, res) => {
  try {
    // console.log('travel_quotes.js get /insurance/type=:type')
    let sql = `select  pp.period_code, P3.compnay_name,
                        p.product_id, p.plan_id, p.generic_name, p.generic_name_kr, p.insured_type, p.trip_type, p.trip_via_usa, p.primary_coverage_type coverage_type,
                        pp.price_code, pp.period_code, pp.default coverage_default,  pv.trip_length_min, pv.trip_length_max, pv.discount, pv.calculate_discount,
                        pp.value_min age_min, pp.value_max age_max, pp.value, pp.rate value_rate, pp.calculate_rate, null multi_trip_rate,
                        (select 
                          COALESCE(json_agg(
                                       json_build_object(
                                           'rate', rate ,          
                                           'value_min', value_min ,
                                           'value_max', value_max ,
                                           'period_code', period_code,
                                           'value', value ,
                                           'calculate_rate', calculate_rate
                                         )),'[]') rate
                                         from plan_price 
                                         where plan_id = pp.plan_id 
                                          and price_code = pp.price_code 
                                          and value_min = pp.value_min
                                          and value_max = pp.value_max
                                         ) ,
                        (select 
                          COALESCE(json_agg(
                                       json_build_object(
                                           'input_code', i.input_code ,          
                                           'price_code', v.price_code ,
                                           'lable', v.lable ,
                                           'value', v.value ,
                                           'discount', v.discount,
                                           'default', v.default 
                                         )),'[]') type_deduct
                                         from plan_value v
                                   join plan_input i on i.input_code = v.input_code and i.input_type = 'DED'  and i.input_code = p.deduct_code
                                         ),
                          null deduct,
                        (select 
                          COALESCE(json_agg(
                                        json_build_object(
                                            'document_type', document_type ,          
                                            'language', language ,
                                            'document_url', document_url
                                          )),'[]') documents
                                          from plan_document
                                          where plan_id = p.plan_id 
                                          )   
                    from plan p
                    join plan_price pp on p.plan_id = pp.plan_id and pp.rate = '1'
                    join product p2 on p.product_id = p2.product_id
                    join (select p.product_id , ic.name compnay_name, p.name product_name
                            from product p
                            join insurance_company ic on p.company_id  = ic.company_id ) p3 on p.product_id  = p3.product_id
                    join (select price_code, value_min trip_length_min, value_max trip_length_max, discount, calculate_discount
                            from plan_value v
                            join plan_input i on i.input_code = v.input_code )  pv on pv.price_code = pp.period_code
                    where p.insured_type = '${req.params.type}' --'VISITOR' --'CANADIAN' --'STUDENT'
                    and p.is_deleted = false
                        `    
    pool.query(sql, function (err, result) {
      if (!err) {
        if (result.rowCount > 0) {
          return res.status(200).json({ data: result })
        } else {
          return res.status(404).json({ data: 'No data found' })
        }
      }
      else
      {
        return res.status(400).json({ error: err.message })
      }
    })
  } catch (err) {
    console.error(err.message)
  }
})

// GET all plan documents (Brochures, Claim Form, Refund Form, Application Form)
router.get('/documents', async (req, res) => {
  try {
    // console.log('insurance_plans.js get /download')  
    let sql = `select pl.*, 
                      (select COALESCE(json_agg(
                                               json_build_object(        
                                                   'language', language ,
                                                   'document_url', document_url
                                                 )),'[]') documents
                                                 from plan_document
                                                 where plan_id = pl.plan_id
                                                 and document_type = pl.document_type
                                                 )
                from (select pd.document_type, 
                              p.company_name, p.insured_type, p.primary_coverage_type, max(p.generic_name) plan_name, min(p.plan_id) plan_id 
                        from (select plan_id, document_type
                                from plan_document 
                                group by plan_id, document_type) pd 
                        join (select p.plan_id, p.product_id, p.generic_name, p.insured_type, p.primary_coverage_type, ic.name company_name
                                from plan p
                                join product prd on prd.product_id = p.product_id
                                join insurance_company ic on ic.company_id = prd.company_id)  p on p.plan_id = pd.plan_id
                        group by pd.document_type, 
                                p.company_name, p.insured_type, p.primary_coverage_type) pl
                order by pl.document_type, pl.company_name, pl.primary_coverage_type, pl.insured_type
                `    
    pool.query(sql, function (err, result) {
      if (!err) {
        if (result.rowCount > 0) {
          return res.status(200).json({ data: result })
        } else {
          return res.status(404).json({ data: 'No data found' })
        }
      }
      else
      {
        return res.status(400).json({ error: err.message })
      }
    })
  } catch (err) {
    console.error(err.message)
  }
})




module.exports = router
