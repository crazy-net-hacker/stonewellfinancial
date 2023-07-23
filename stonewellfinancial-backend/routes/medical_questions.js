require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')



// GET all medical questionnaire
router.get('/', async (req, res) => {
  try {
    // console.log('medical_questions.js get /')
    // let sql = `select q1.company_id, q1.code,  q.question_code, q.name, q.header_content_kr, q.content_kr question_kr,
    //                   a.answer_code, a.content_kr answer_kr, a.value, 
    //                   a.calculation_rate, a.name, q.input_type, q.break_point, q.break_rate
    //             from question q
    //             join questionnaire q1 on q1.questionnaire_id = q.questionnaire_id 
    //             join answer a on a.questionnaire_id = q.questionnaire_id and a.question_code = q.question_code
    //             order by q1.company_id, q1.code, q.sort_order, a.name
    //      
    let sql = `select q1.company_id, q1.questionnaire_id, q1.code, q.question_code, q.name, q.header_content_kr, q.content_kr question_kr,
                      q.header_content_en, q.content_en question_en,
                      q.input_type, q.break_point, q.break_rate,
                      (select 
                              COALESCE(json_agg(
                                            json_build_object(
                                                'answer_code', a.answer_code ,          
                                                'content_kr', a.content_kr ,
                                                'content_en', a.content_en ,
                                                'calculation_rate', a.calculation_rate,
                                                'name', a.name 
                                              )
                                              order by CAST((CASE upper(name) WHEN 'YES' THEN '0'
                                                                      WHEN 'NO' THEN '1' 
                                                                      ELSE name end) AS numeric)
                                              ),'[]') answer
                          from medical_answer a 
                          where a.questionnaire_id = q.questionnaire_id and a.question_code = q.question_code
                          )     
              from medical_question q
              join questionnaire q1 on q1.questionnaire_id = q.questionnaire_id
              order by 1,2,3, q.sort_order
      `        

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


// GET medical questionnaire
router.get('/company=:comapnyID&code=:questionCode', async (req, res) => {
  try {
    console.log('questions.js get /')
    let sql = `select q.questionnaire_id, q.question_code, q.name, q.header_content_kr, q.content_kr question_kr,
                      a.answer_code, a.content_kr answer_kr, a.value, 
                      a.calculation_rate, a.name, q.input_type, q.break_point, q.break_rate
                from question q
                join questionnaire q1 on q1.questionnaire_id = q.questionnaire_id 
                                    and q1.company_id = ${req.params.comapnyID} --'ICO00002' 
                                    and q1.code = ${req.params.questionCode}  --'QU-TMQ-4'
                join answer a on a.questionnaire_id = q.questionnaire_id and a.question_code = q.question_code
                order by q.questionnaire_id, q.sort_order, a.name
              `
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