const { body } = require('express-validator')
const User = require('../../models/User')

module.exports  = [
    body('username')
        .isLength({ min: 2, max: 15 }).withMessage('Username Must Be Between 2 to 15 Chars')
        .custom(async username => {
            let user = await User.findOne({ username })
            if (user) {
                return Promise.reject('User Name Already Used')
            }
        }).trim()
    ,
    body('email')
        .isEmail().withMessage('Please Peovide A Valid Email')
        .custom(async email => {
            let user = await User.findOne({ email })
            if (user) {
                return Promise.reject('Email Name Already Used')
            }
        }).normalizeEmail()
    ,
    body('password')
        .isLength({ min: 5 }).withMessage('Password Must Be Greater Than 5 Characters ')
    ,
    body('confirmPassword')
        .isLength({ min: 5 }).withMessage('Password Must Be Greater Than 5 Characters ')
        .custom((confirmPassword, { req }) => {
            if (confirmPassword !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true
        })
]