const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

// authenticate token
router.get('/:token', async (req, res) => {
  //get the session ID from the cookies
  const token = req.params.token
  if (token) {
    //if the cookie is set, query the db, get the email, name and role
    const user = await validateToken(token, process.env.JWT_REFRESH_SECRET)
    res.send(user)
  }
})

async function validateToken(token, secret) {
  try {
    const result = jwt.verify(token, secret)
    return {
      email: result.email,
      name: result.name,
      role: result.role,
      userId: result.userId
    }
  } catch (ex) {
    return null
  }
}

async function randomString() {
  return crypto.randomBytes(64).toString('hex')
}

function sha256(txt) {
  const secret = 'abcdefg'
  const hash = crypto.createHmac('sha256', secret).update(txt).digest('hex')
  return hash
}

module.exports = router
