require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const chalk = require('chalk')

const setMiddleware = require('./middleware/middleware')
const setRoute = require('./routes/routes')


const MONGODB_URI = 'mongodb://localhost/exp-blog'



  
const app = express()

console.log(config.get('name'));

// Setup view Engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// Using Middleware from Middleware Directory
setMiddleware(app)
// Using Routes from Route Directory
setRoute(app)

//Error Handle
app.use((req,res,next) => {
    let error = new Error('404 Page Not Found')
    error.status = 404
    next(error)
})

app.use((error,req,res,next) => {
    if(error.status == 404 ){
        return res.render('pages/error/404',{flashMessage:{}})
    }
    console.log(chalk.red.inverse(error.message));
    console.log(error)
    return res.render('pages/error/500',{flashMessage:{},})
})

const PORT = process.env.PORT || 8080
//DB Connect
mongoose.connect( MONGODB_URI , {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})
    .then(() => {
        console.log(chalk.green('Database is Runnig'));
        app.listen(PORT, () => {
            console.log(chalk.green.inverse(`Server is runnig ${PORT}`))
        })
    })
    .catch(e => {
        return console.log(e)
    })