const jwt = require('jsonwebtoken')

const authenticateRefreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        return res.status(401).json({message: "No token"})
    }

    try{
        const userData = await jwt.verify(refreshToken, process.env.JWT_SECRET_RF, (err, decoded) => {
            if(err){
                return res.status(401).json({message: "Unauthorized token"})
            }
            req.body.userId = decoded.userId
            console.log(`===========>refresh token set in the req.body ====> ${req.body.userId}`)
        })
        return next()
    }catch(error){
        console.log(error)
        return res.status(500).json({message: "Internal server error"})

    }
}

module.exports = authenticateRefreshToken