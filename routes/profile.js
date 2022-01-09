const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const Profile = require("../models/Profile");
// for github fetch api 
const request = require("request");
const config = require("config");
const User = require("../models/User");
const Post = require("../models/Posts");

// @route   GET /profile/me
// @desc    Get current users profile
// @access  Private
router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            "user",
            ["name", "avatar"]
        );
        if (!profile) {
            return res
                .status(400)
                .json({ msg: "There is no profile for this user. " });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error.");
    }
});

// @route   POST /profile
// @desc    Create or update user profile
// @access  Private
router.post(
    "/",
    [
        auth,
        check("studies", "Unesite smer na kom studirate").not().isEmpty(),
        check("yearofstudy", "Unesite godinu studija. (1-3) ").not().isEmpty(),
        // .isInt({
        //     min: 1,
        //     max: 3,
        // })
        check(
            "status",
            "Unesite kojom oblašću IT-a se bavite ili želite da se bavite."
        )
            .not()
            .isEmpty(),
        check("skills", "Unesite koje veštine iz IT-a posedujete.").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            studies,
            yearofstudy,
            status,
            skills,
            bio,
            githubusername,
            instagram,
            facebook,
            twitter,
            linkedin,
        } = req.body;

        // build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (studies) profileFields.studies = studies;
        if (yearofstudy) profileFields.yearofstudy = yearofstudy;
        if (status) profileFields.status = status;
        if (skills) {
            profileFields.skills = skills.split(",").map((skill) => skill.trim());
        }
        if (bio) profileFields.bio = bio;
        if (githubusername) profileFields.githubusername = githubusername;
        // build social object
        profileFields.social = {};
        if (instagram) profileFields.social.instagram = instagram;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (linkedin) profileFields.social.linkedin = linkedin;

        try {
            let profile = await Profile.findOne({ user: req.user.id });
            if (profile) {
                // update profile
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
                return res.json(profile);
            }

            // create the profile if there isnt a profile
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error.");
        }
    }
);

// @route   GET /profile
// @desc    Get all profiles
// @access  Public
router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find().populate("user", ["name", "avatar"]);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error.");
    }
});

// @route   GET /profile/user/:user_id
// @desc    Get profile by user id
// @access  Public
router.get("/user/:user_id", async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id,
        }).populate("user", ["name", "avatar"]);
        if (!profile) return res.status(400).json({ msg: "Profile Not Found. " });
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error.");
    }
});

// @route   DELETE /profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete("/", auth, async (req, res) => {
    try {
        // remove user posts
        await Post.deleteMany({ user: req.user.id });
        // remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // remove profile
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: "User removed. " });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error.");
    }
});

// @route   PUT /profile/projects
// @desc    Add project experience
// @access  Private
router.put(
    "/projects",
    [
        auth,
        // we are gonna need validation because we are gonna have on frontend react a validation form
        check("title", "Dodajte naslov projekta.").not().isEmpty(),
        check("description", "Dodajte opis projekta").not().isEmpty(),
        check("from", "Dodajte datum rada na projektu").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            description,
            from,
            to,
            current
        } = req.body;

        const newProj = {
            title: title,
            description: description,
            from: from,
            to: to,
            current: current
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.projects.unshift(newProj);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error.");
        }
    }
);

// @route   DELETE /profile/projects/:proj_id
// @desc    Delete a project
// @access  Private
router.delete("/projects/:proj_id", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        // get the project we want to remove
        const removeIndex = profile.projects.map(project => project.id).indexOf(req.params.proj_id);
        // remove the project
        profile.projects.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error.");
    }
});

// @route   GET /profile/github/:username
// @desc    Get user repos from github
// @access  Public
router.get("/github/:username", async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=3&sort=created:asc&client_id=${config.get("githubClientID")}&client_secret=${config.get("githubSecret")}`,
            method: "GET",
            headers: { "user-agent": "node.js" }
        };
        request(options, (error, response, body) => {
            if (error) console.error(error);
            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: "No GitHub Profile Found. " });
            }
            res.json(JSON.parse(body));
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error.");
    }
})

module.exports = router;
