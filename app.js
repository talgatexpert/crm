const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')
const analyticsRoutes = require('./routes/analytics')
const categoryRoutes = require('./routes/category')
const orderRoutes = require('./routes/order')
const positionRoutes = require('./routes/position')
const keys = require('./config/keys')
const passport  = require('passport')

mongoose.connect(keys.mongoURI)
 .then(() => console.log('mongo db conected'))
 .catch(error => console.log('error'))

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use('/api/auth', authRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/position', positionRoutes)
app.use(cors())



module.exports = app