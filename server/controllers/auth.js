const User = require('../models/user')
const shortId = require('shortid')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')


exports.signup = (req, res) => {
    User.findOne({ email: req.body.email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'email has been taken'
            })
        }

        const { name, email, password } = req.body
        let username = shortId.generate()
        let profile = `${process.env.CLIENT_URL}/profile/${username}`;
        let newUser = new User({ name, email, password, profile, username })

        newUser.save((err, success) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json({
                message: 'Signup success! Please return to signin.'
            })
        })
    })

};

exports.signin = (req, res) => {
    const { email, password } = req.body;

    //check if user exist
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User with the email does not exist, please signup first"
            })
        }
        //authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: err
            })
        }
        //generate JWT and send to client side
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '3d'
        })

        res.cookie('token', token, { expiresIn: '3d' })

        const { _id, username, name, email, role } = user;
        return res.json({
            token,
            user
        })

    })
}

exports.signout = (req, res) => {
    res.clearCookie("token")
    res.json({
        message: 'Signout success'
    })
}
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
});