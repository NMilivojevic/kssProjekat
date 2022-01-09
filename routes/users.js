const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");

// @route   POST /users
// @desc    Register user
// @access  Public
router.post(
    "/",
    [
        check("name", "Name is required.").not().isEmpty(),
        check("email", "Please include a valid email.").isEmail(),
        check(
            "password",
            "Please enter a password with 6 or more characters."
        ).isLength({ min: 6 }),
    ],
    // async here and then try catch inside and then inside await for functions that return the promises
    async (req, res) => {
        // console.log(req.body); we need a body parser to get the data from req object when we send it from postman (express.json);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        // mongoose query with promises
        try {
            // see if user exists
            let user = await User.findOne({ email });
            if (user) {
                res.status(400).json({ errors: [{ msg: "User already exists." }] });
            }
            // get users gravatar based on email
            const avatar = gravatar.url(email, {
                s: "200",
                r: "x",
                d: "mm",
            });

            user = new User({
                name,
                email,
                avatar,
                password,
            });
            // encrypt password using bycript (using documentation)
            const salt = await bcrypt.genSalt(10);
            // hashing the password
            user.password = await bcrypt.hash(password, salt);

            // save user to database (returns a promise)
            await user.save();

            // return jsonwebtoken in order when user registers to be logged in right away and protect our routes with a middleware
            // const payload = {
            //     user: {
            //         id: user.id
            //     }
            // }
            jwt.sign(
                // first we get the payload, the user data = we only need id
                {
                    user: {
                        id: user.id,
                    },
                },
                config.get("jwtSecret"),
                {
                    expiresIn: 3600000
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error.");
        }
    }
);

module.exports = router;
