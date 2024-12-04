const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const subjectAttendanceSchema = new mongoose.Schema({
    date:{
        type: String,
        //type: mm/dd/yyyy
        required: true
    },
    status:{
        type: Number,
        required: true,
        enum: [0, 1]
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

studentSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

studentSchema.methods.generateAccessToken = async function() {
    // ACCESS TOKEN: this token keeps refreshing every hour, 
    // for example, if a user is viewing their profile, they need to pass this accesstoken with api call so we know that this user is authorized to do the action
    // if the access token expires we define a refresh route to rengenerate a refresh token
    try{
        return await jwt.sign(
            {
                userId: this._id.toString(),
            },
            process.env.JWT_SECRET_AC,
            { expiresIn: '1h' }
        )
    }catch(err){
        console.error(error)
    }
}
studentSchema.methods.generateRefreshToken = async function() {
    try{
        return await jwt.sign(
            {
                userId: this._id.toString(),
            },
            process.env.JWT_SECRET_RF
        )
        
    }catch(err){
        console.error(error)
    }
}

const Student = mongoose.model('student', studentSchema)
module.exports = Student