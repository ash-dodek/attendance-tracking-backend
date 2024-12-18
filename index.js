const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()

require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(
    cors({
        origin: 'http://localhost:5173', // Allow frontend origin
        credentials: true, // Allow cookies to be sent
    })
)

app.get('/', (req, res) => {
    res.json({message: "We Up"})
})

app.use('/user', require('./routes/user.routes'))
app.use('/attendance', require('./routes/attendance.routes'))

mongoose.connect(`mongodb+srv://sampleBase:${process.env.DB_CONNECTION_PASSWORD}@cluster0.oqumgie.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority&appName=Cluster0`)
.then(() => {
    app.listen(process.env.PORT, process.env.HOSTNAME,() => {
        console.log(`Connected to the database and server running at http://localhost:${process.env.PORT}/ \n`)
    })
})