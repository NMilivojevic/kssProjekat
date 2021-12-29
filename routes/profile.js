const express = require("express");
const router = express.Router();

// @route   GET /profile
// @desc    Test route
// @access  Public route (token not necessary)
router.get("/", (req, res) => {
    res.send("profile Route.");
})

module.exports = router;