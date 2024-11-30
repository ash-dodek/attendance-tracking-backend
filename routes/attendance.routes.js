const express = require('express')
const addStudentAttendance = require('../controllers/attendance.controller')
const router = express.Router()


router.post('/mark', addStudentAttendance)

module.exports = router