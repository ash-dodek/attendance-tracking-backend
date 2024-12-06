const jwt = require('jsonwebtoken')

const authenticateRefreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        return res.status(401).json({message: "Unauthorized"})
    }

    try{
        const userData = await jwt.verify(refreshToken, process.env.JWT_SECRET_RF)
        if(!userData){
            return res.status(401).json({message: "Unauthorized"})
        }
        return next()
    }catch(error){
        console.log(error)
        return res.status(500).json({message: "Internal server error"})

    }
}

module.exports = authenticateRefreshToken