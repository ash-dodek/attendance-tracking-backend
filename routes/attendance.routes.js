const express = require('express')
const attController = require('../controllers/attendance.controller')
const authenticateRefreshToken = require('../middlewares/authenticateToken')
const router = express.Router()


router.post('/mark', authenticateRefreshToken, attController.addStudentAttendance)

router.get('/find', authenticateRefreshToken, attController.findSubjectAttendance)

router.post('/subject/add', authenticateRefreshToken, attController.addSubject)

router.post('/subject/remove', authenticateRefreshToken, attController.removeSubject)

module.exports = router