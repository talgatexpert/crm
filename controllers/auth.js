const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')


module.exports.login = async function(req, res){
    const candidate = await User.findOne({email: req.body.email})
    if (candidate){
        //Проверка пароля пользователя, существует
       const passwordResult = bcrypt.compareSync(req.body.password, candidate.password) 
        if (passwordResult){
            //pasword true

            const token = jwt.sign({
                email: candidate.email,
                userId : candidate._id
            }, keys.jwt, {expiresIn: 60*60})

            res.status(200).json({
                token: `Bearer ${token}`
            })

        } else { //password false
            res.status(401).json({
                message: 'password dont much. Try again'
            })
        }
    } else {
        // Ползователь не существует
        res.status(404).json({
            message: 'User its email not found'
        })
    }

}



module.exports.register = async function(req, res){
   
    const candidate = await User.findOne({email: req.body.email})
    if(candidate){
        // User has been 
        res.status(409).json({
            message: 'user has been'
        })
    } else {
        //need create user
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })
        try {
            await user.save()
            res.status(201).json(user)

        } catch (e) {
            // error user
            errorHandler(res, e)
        }
    }
}