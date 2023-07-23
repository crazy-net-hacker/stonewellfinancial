require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');

const app = express()

const cors = require('cors')
const cookieParser = require('cookie-parser')
const routes = require('./routes')

// middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(routes)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server listening at ${port}`)
})

module.exports = app