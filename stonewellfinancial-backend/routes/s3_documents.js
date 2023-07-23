require('dotenv')
const express = require('express')
const router = express.Router()

const sendToS3 = require('../middlewares/awsS3/sendToS3')

// 
router.get('/type=:type&fileName=:fileName', async (req, res) => {
  try {
      // console.log('s3_documents.js GET /type=:type&fileName=:fileName')

      let file = await sendToS3.getFromS3(`${req.params.type}/${req.params.fileName}`)
      // console.log(file)

      if (file){
          res.status(200).json({
              "status":"success",
              "file": file
              })
      }else{
            res.status(400).json({
              "status":"fail",
              "file": ''
              })
      }
          
    } catch (err) {
    // console.error(err.message)
    res.json({
      data: err.message
      })
  }
})


router.get('/search', async (req, res) => {
  try {
      // console.log('s3_documents.js GET /search')

      const parmFileName = req.query.fileName.split(",")
      const files = []

      for (const i in parmFileName) {
        const fileRes = await sendToS3.getFromS3(`${req.query.type}/${parmFileName[i]}`)
        files.push({fileName: parmFileName[i], file:fileRes?fileRes:null})
      }

      if (files.length>0){
          res.status(200).json({
              "status":"success",
              "files": files
              })
      }else{
            res.status(400).json({
              "status":"fail",
              "files": ''
              })
      }
          
    } catch (err) {
    // console.error('error',err.message)
    res.send({
      "status":"error",
      "message": "Something went wrong",
      })
  }
})




module.exports = router