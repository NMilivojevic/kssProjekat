const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // bringing in the middleware
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// @route   GET /auth
// @desc    Test route
// @access  Public route (token not necessary)
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error.");
    }
})

// @route   POST /auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
    "/",
    [
        check("email", "Please include a valid email.").isEmail(),
        check(
            "password",
            "Password is required."
        ).exists(),
    ],
    // async here and then try catch inside and then inside await for functions that return the promises
    async (req, res) => {
        // console.log(req.body); we need a body parser to get the data from req object when we send it from postman (express.json);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        // mongoose query with promises
        try {
            // see if user exists
            let user = await User.findOne({ email });
            if (!user) {
                res.status(400).json({ errors: [{ msg: "Invalid credentials." }] });
            }

            // return jsonwebtoken in order when user registers to be logged in right away and protect our routes with a middleware
            // const payload = {
            //     user: {
            //         id: user.id
            //     }
            // }

            // we need to match email and password and we did this compare(returns a promise) with bcrypt
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(400).json({ errors: [{ msg: "Invalid credentials." }] });
            }

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