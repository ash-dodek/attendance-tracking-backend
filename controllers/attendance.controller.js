const Student = require("../models/student.model")
const jwt = require('jsonwebtoken')

const getTodayDate = () => {
    let today = new Date()
    let dd = String(today.getDate()).padStart(2, '0')
    let mm = String(today.getMonth() + 1).padStart(2, '0')
    let yyyy = today.getFullYear()

    today = mm + '/' + dd + '/' + yyyy
    return today
}

const addStudentAttendance = async (req, res) => {
    const {email, status, subject} = req.body
    if (!email || !subject || !status) {
        return res.status(400).json({ message: "Insufficient information provided" });
    }

    const student = await Student.findOne({ email });

    let subjectIsThere = false
    let subjectObj;//will push data(attendance in the records field) using this object
    for(let subjectObject of student.attendance){
        if(subjectObject.subject === subject){
            subjectIsThere = true
            subjectObj = subjectObject
        }
        else{
            subjectIsThere = false
        }
    }

    if(subjectIsThere && student.attendance != []){
        subjectObj.records.push({
            date: getTodayDate(),
            status: status
        })
    }

    else if (!subjectIsThere){
        student.attendance.push({
            subject: subject,
            records:[{
                date: getTodayDate(),
                status: status
            }]
        })
    }

    const updatedStudent = await student.save()

    res.status(200).json(updatedStudent)
}

const findSubjectAttendance = async (req, res) => {
    try{

        const {email, subject} = req.body
        const token = req.cookie.refreshToken
        const foundStudent = await Student.findOne({email})
        if(!foundStudent){
            return res.status(400).json({message: "Student not found"})
        }

        for (const subjectObject of foundStudent.attendance) {
            if(subjectObject.subject === subject){
                return res.status(200).json(subjectObject.records)
                //subjectObject.records return an array [] to be decoded at frontend
            }
        }
        
        return res.status(400).json({message: "Subject not found"})

    }catch(error){
        console.log(error)
        res.status(400).json({message: "Internal server error"})
    }

}


const addSubject = async (req, res) => {
    const {subject} = req.body
    const token = req.cookies.refreshToken

    try{

        const decoded = jwt.decode(token, {complete:true})
        const foundStudent = await Student.findOne({_id:decoded.payload.userId})

        if(foundStudent.attendance){
        }
        for (const subjectObj of foundStudent.attendance) {
            if(subjectObj.subject === subject){
                return res.status(400).json({message: "Subject already exists"})
            }
        }

        foundStudent.attendance.push({
            subject: subject,
            records: [],
        })

        foundStudent.save()
        return res.status(200).json({message: `Subject ${subject} added`})

    }catch(error){
        console.log(error)
        res.status(400).json({message: "Internal server error"})
    }
}

const removeSubject = async (req, res) => {
    const {subject} = req.body
    const token = req.cookies.refreshToken

    try{

        const decoded = jwt.decode(token, {complete:true})
        const foundStudent = await Student.findOne({_id:decoded.payload.userId})

        for (const subjectObj of foundStudent.attendance) {
            if(subjectObj.subject === subject){
                foundStudent.attendance.pull(subjectObj)
                foundStudent.save()
                return res.status(200).json({message: `Subject ${subject} removed`})
            }
        }

        return res.status(400).json({message: "Subject not found"})

    }catch(error){
        console.log(error)
        res.status(400).json({message: "Internal server error"})
    }
}
module.exports = {addStudentAttendance, findSubjectAttendance, addSubject, removeSubject}