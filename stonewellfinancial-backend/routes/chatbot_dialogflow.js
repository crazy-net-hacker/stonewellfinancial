require('dotenv')
const express = require('express')
const router = express.Router()

const chatbot = require('../chatbot/chatbot')

// 
router.get('/', async (req, res) => {
  try {
    return res.status().json({ 'hello': 'Johnny' })

  } catch (err) {
    console.error(err.message)
  }
})



router.post('/df_test_query', async (req, res) => {
  try {

    let responses =  await chatbot.textQuery(req.body.text, req.body.parameters);

    return res.send(responses[0].queryResult)


  } catch (err) {
    // console.error(err.message)
  }
})

// 
router.post('/df_event_query', async (req, res) => {
  try {

    let responses =  await chatbot.eventQuery(req.body.event, req.body.parameters);

    return res.send(responses[0].queryResult)

  } catch (err) {
    // console.error(err.message)
  }
})

module.exports = router