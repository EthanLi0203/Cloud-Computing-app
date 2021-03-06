const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const indexRoutes = require('./routes/index')
const authRoutes = require('./routes/auth')
const addressRoute = require('./routes/smartyAddress')
    // app
const app = express()

// db
mongoose.connect(process.env.DATABASE_CLOUD, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB connected'))

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())

//cors
if (process.env.NODE_ENV == "development") {
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }))
}

//routes
app.use('/api', indexRoutes)
app.use('/api', authRoutes)
app.use('/api', addressRoute)

//port 
const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})
