const Student = require("../models/student.model")

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
    let subjectObj;//will use this object to push final data
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
        console.log(`Subject is ${subjectObj}`)

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
    // if (!updatedStudent) {
    //     return res.status(404).json({ message: "Student not found." });
    // }

    res.status(200).json(updatedStudent)

}

module.exports = addStudentAttendance