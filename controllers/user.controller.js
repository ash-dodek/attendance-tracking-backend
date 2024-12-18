const Student = require('../models/student.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
    try {
        
        let {name, username, password} = req.body
        const savedUser = await Student.create({name, username, password})
        const refreshToken = await savedUser.generateRefreshToken()
        const accessToken = await savedUser.generateAccessToken()

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 365 * 24 * 60 * 60 * 1000
        })// we set the refreshTOken in the cookie which is set to httpOnly(only accessible by backend)
        // res.header('Access-Control-Allow-Credentials', 'true');


        //we will give the accesstoken in json for which further work will be done in the frontend
        res.status(200).json({accessToken, savedUser})

    } catch (error) {
        if(error.code === 11000){// mongodb return error code 11000 if duplicate key found
            console.log(error)
            return res.status(419).json({message: "User already exists with that username"})
        }
        else{
            console.log(error)
            return res.status(500).json({message: "Internal server error"})
        }

    }
}


const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body
        const userExists = await Student.findOne({username})

        if(!userExists){
            return res.status(400).json({message: "Invalid credentials"})
            //if invalid credentials
        }
        console.log(userExists)
        if(await bcrypt.compare(password, userExists.password)){
            //if correct pwd and username then proceed further and generate the required tokens and set them
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

const logoutUser = async(req, res) => {
    res.clearCookie('refreshToken')
    res.status(200).json({message: "Logged out"})
}

const verifyAccessToken = (req, res, next) => {
    const accessToken = req.headers.authorization
    if(!accessToken){
        return res.status(401).json({message: "Access token not found"})
    }

    jwt.verify(accessToken, process.env.JWT_SECRET_AC, (err, decoded) => {
        if(err){
            return res.status(401).json({message: "Unauthorized"})
        }
        else{
            return res.json({message:"Valid token"})
        }
    })
}

const authenticateUser = async(req, res) => {
    const refreshToken = req.cookies.refreshToken


    if(!refreshToken){
        return res.status(401).json({message: "No refresh token"})
    }

    try{
        const userData = await jwt.verify(refreshToken, process.env.JWT_SECRET_RF)
        if(!userData){
            return res.status(401).json({message: "Unauthorized"})
        }
        const user = await Student.findOne({_id: userData.userId})
        if(user === null){
            return res.status(400).json({message: "No User found"})
        }
        return res.status(200).json(user)
    }catch(error){
        console.log(error)
        return res.status(500).json({message: "Internal server error"})

    }
}
module.exports = {registerUser, loginUser, refreshesAccessToken, logoutUser, authenticateUser, verifyAccessToken}