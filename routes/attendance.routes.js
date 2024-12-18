const express = require('express')
const attController = require('../controllers/attendance.controller')
const authenticateRefreshToken = require('../middlewares/authenticateToken')
const router = express.Router()


// /attendance route

router.post('/mark', authenticateRefreshToken, attController.addStudentAttendance)

router.post('/find', authenticateRefreshToken, attController.findSubjectAttendance)

router.get('/subjects', authenticateRefreshToken, attController.getSubjects)

router.post('/subject/add', authenticateRefreshToken, attController.addSubject)

router.post('/subject/remove', authenticateRefreshToken, attController.removeSubject)

module.exports = router