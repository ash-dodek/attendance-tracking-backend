const mongoose = require('mongoose')

const subjectAttendanceSchema = new mongoose.Schema({
    date:{
        type: String,
        //type: mm/dd/yyyy
        required: true
    },
    status:{
        type: String,
        required: true,
        enum: ["0", "1"]
    }
})

const attendanceSchema = new mongoose.Schema({
    subject:{
        type: String,
        required: true
    },
    records: [subjectAttendanceSchema]
})


const studentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    
    attendance: [attendanceSchema],
})

const Student = mongoose.model('student', studentSchema)
module.exports = Student