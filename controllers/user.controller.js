const Student = require('../models/student.model')

const registerUser = async (req, res) => {
    const {name, email, password} = req.body
    const savedUser = await Student.create({name, email, password})
    res.json(savedUser)
    console.log("just a chill gyus")
}

module.exports = registerUser