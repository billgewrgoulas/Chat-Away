const express = require("express");
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Room = require('../models/Room');
const {
    forwardAuthenticated,
    ensureAuthenticated
} = require("../utils/authentication");
const {
    encodeData
} = require('../utils/helpers');
const {
    Cookie
} = require("express-session");
require('dotenv/config');

//login post request
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {},
        (error, user, info) => {
            if (error) res.status(400).json({
                "statusCode": 200,
                "message": req.flash('message')
            });

            req.login(user, (error) => {
                if (error) {
                    res.status(404).json({
                        "statusCode": 404,
                        "message": req.flash('message')
                    });
                } else {
                    next();
                }
            })
        })(req, res, next)
}, (req, res) => {
    res.status(200).json({
        "statusCode": 200,
        "message": "Success",
        "user": encodeData(req.user),
    });
});

//logout
router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    res.status(200).json({
        "statusCode": 200,
        "messsage": "Log out was succesfull"
    });
});

//check if the user email is already registered
router.post('/validateEmail', forwardAuthenticated, async(req, res) => {
    try {
        const userInDb = await User.findOne({
            email: req.body.email
        });
        if (userInDb) {
            console.log(req.body);
            res.status(200).json({
                "statusCode": 200,
                "message": "Email exists",
                "found": true,
            });
        } else {
            res.status(200).json({
                "statusCode": 200,
                "found": false,
                "message": "Email doesnt exist"
            });
        }
    } catch {
        res.status(400).json({
            "statusCode": 400,
            "found": false,
            "message": "Something Is broken , most likely connection to the database could not be established"
        });
    }
});

//register post request
router.post('/register', forwardAuthenticated, (req, res) => {

    const {
        name,
        email,
        password
    } = req.body;

    const newUser = new User({
        name: name,
        email: email,
        password: password
    });

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser
                .save()
                .then((user) => {
                    req.login(user, (err) => {
                        if (err) {
                            throw err;
                        }
                    });
                    res.status(200).json({
                        "statusCode": 200,
                        "message": "You are registerd",
                        "user": encodeData(req.user)
                    });
                })
                .catch((err) => {
                    console.log(err)
                });
        });
    });
});

module.exports = router;