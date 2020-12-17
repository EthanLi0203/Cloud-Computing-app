const User = require('../models/user')
const shortId = require('shortid')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const {OAuth2Client} = require('google-auth-library')

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
exports.googleLogin = (req, res) => {
    const idToken = req.body.tokenId;
    console.log("back", idToken)
    client.verifyIdToken({idToken, audience: process.env.GOOGLE_CLIENT_ID}).then(response => {
        console.log("response", response)
        const {email_verified, name, email, jti} = response.payload;
        if(email_verified){
            User.findOne({email}).exec((err, user) => {
                if(user){
                    console.log(user)
                    const token = jwt.sign({_id: user._id, email: user.email, role: user.role == 0? "USER" : "ADMIN"}, process.env.JWT_SECRET, {expiresIn:'1d'})
                    res.cookie('token', token, {expiresIn: '1d'})
                    const {_id, email, name, role, username} = user;
                    return res.json({token, user: {_id, email, name, role, username}})
                }else{
                    let username = shortId.generate();
                    // let profile = `${process.env.CLIENT_URL}/profile/${username}`
                    let password = jti + process.env.JWT_SECRET;
                    user = new User({name, email, username, password})
                    user.save((err, data) => {
                        if(err){
                            return res.status(400).json({
                                error: errorHandler(err)
                            })
                        }
                        const token = jwt.sign({_id: data._id}, process.env.JWT_SECRET, {expiresIn:'1d'})
                        res.cookie('token', token, {expiresIn: '1d'})
                        const {_id, email, name, role, username} = data;
                        return res.json({token, user: {_id, email, name, role, username}})
                    })
                }
                
            })
        }else{
            return res.status(400).json({
                error: 'Google login failed, try again later'
            })
        }
    })
}

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
console.log(email)
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
        const token = jwt.sign({ _id: user._id, email: user.email, role: user.role == 0 ? "USER" : "ADMIN" }, process.env.JWT_SECRET, {
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