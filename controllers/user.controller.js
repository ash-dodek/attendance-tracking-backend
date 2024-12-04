const Student = require('../models/student.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
    try {
        
        let {name, email, password} = req.body
        const savedUser = await Student.create({name, email, password})
        const refreshToken = await savedUser.generateRefreshToken()
        const accessToken = await savedUser.generateAccessToken()

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 365 * 24 * 60 * 60 * 1000
        })// we set the refreshTOken in the cookie which is set to httpOnly(only accessible by backend)

        //we will give the accesstoken in json for which further work will be done in the frontend
        res.status(200).json({accessToken, savedUser})

    } catch (error) {
        if(error.code === 11000){// mongodb return error code 11000 if duplicate key found
            return res.status(400).json({message: "User already exists with that email"})
        }
        else{
            return res.status(500).json({message: "Internal server error"})
        }

    }
}


const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body
        const userExists = await Student.findOne({email})

        if(!userExists){
            return res.status(400).json({message: "Invalid credentials"})
            //if invalid credentials
        }
        if(await bcrypt.compare(password, userExists.password)){
            //if correct pwd and email then proceed further and generate the required tokens and set them
            const accessToken = await userExists.generateAccessToken()
            const refreshToken = await userExists.generateRefreshToken()

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 365 * 24 * 60 * 60 * 1000
            })

            return res.status(200).json({
                message: "Logged in",
                accessToken
            })

        }
        else{
            return res.status(400).json({message: "Invalid credentials"})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error"})
    }
}


const refreshesAccessToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        return res.status(400).json({message: "Bad Request"})
    }

    //verifying refreshToken if its genuine if it is, then provide a new accessToken

    jwt.verify(refreshToken, process.env.JWT_SECRET_RF, (err, decoded) => {
        if (err){
            return res.status(403).json({ message: 'Invalid or expired refresh token' })
        }
        const newAccessToken = jwt.sign(
            {
                userId: decoded.userId,
            },
            process.env.JWT_SECRET_AC
        )
        res.json({accessToken: newAccessToken})
    })
}
module.exports = {registerUser, loginUser, refreshesAccessToken}