const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()

require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

const PORT = process.env.PORT || 3000

const allowedOrigins = process.env.ORIGIN.split(',')
try {
    
    const corsOptions = {
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS, request from ' + origin));
            }
        },
        credentials: true,
    };
    app.use(
        cors(corsOptions)
    )
} catch (error) {
    console.log(error.message)
}



app.get('/', (req, res) => {
    res.json({message: "We Up"})
})

app.use('/user', require('./routes/user.routes'))
app.use('/attendance', require('./routes/attendance.routes'))

mongoose.connect(`mongodb+srv://sampleBase:${process.env.DB_CONNECTION_PASSWORD}@cluster0.oqumgie.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority&appName=Cluster0`)
.then(() => {
    app.listen(PORT, process.env.HOSTNAME,() => {
        console.log(`Connected to the database and server running at http://localhost:${PORT}/ \n`)
    })
})