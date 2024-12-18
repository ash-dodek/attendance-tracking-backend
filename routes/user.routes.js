const express = require('express')
const userController = require('../controllers/user.controller')
const router = express.Router()


router.post('/register', userController.registerUser)

router.post('/login', userController.loginUser)

router.get('/refresh', userController.refreshesAccessToken)

router.post('/logout', userController.logoutUser)

router.get('/isLogged', userController.authenticateUser)

router.get('/refresh', userController.refreshesAccessToken)

router.get('/verify', userController.verifyAccessToken)

module.exports = router