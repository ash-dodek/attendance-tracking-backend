const express = require('express')
const registerUser = require('../controllers/user.controller')
const router = express.Router()

// router.post('/login', (req, res) => {
//     res.json({message:"Login route"})
// })

router.post('/register', registerUser)

module.exports = router