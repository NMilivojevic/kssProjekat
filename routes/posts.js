const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Post = require("../models/Posts");

// @route   POST /posts
// @desc    Create a post
// @access  Private
router.post("/",
    [
        auth,
        check("text", "Unesite svoj post").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const user = await User.findById(req.user.id).select("-password");
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })

            const post = await newPost.save();
            res.json(post);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server greška");
        }
    }
);

// @route   GET /posts
// @desc    Get all posts
// @access  Private
router.get("/", auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 }); // sort by newest first
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server greška");
    }
});

// @route   GET /posts/:id
// @desc    Get post by id
// @access  Private
router.get("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // check if there is a post with that id
        if (!post) {
            return res.status(404).json({ msg: "Post nije pronađen" });
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server greška");
    }
});

// @route   DELETE /posts/:id
// @desc    Delete a post
// @access  Private
router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // make sure that the user deleting the post is the user that is trying to delete the post
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Korisnik nije autorizovan" });
        }
        await post.remove();
        res.json({ msg: "Post izbrisan " });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server greška");
    }
});

// @route   PUT /posts/like/:id
// @desc    Like a post
// @access  Private
router.put("/like/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // check if post has already been liked by this particular user
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) { // if > 0 it is already been liked
            return res.status(400).json({ msg: "Post je već lajkovan" });
        }
        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server greška");
    }
});

// @route   PUT /posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put("/unlike/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // check if post has already been liked by this particular user
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) { // if === 0 we havent liked it yet
            return res.status(400).json({ msg: "Post još uvek nije lajkovan" });
        }
        // get the remove index 
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        // remove the like
        post.likes.splice(removeIndex, 1);
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server greška");
    }
});

// @route   POST /posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post("/comment/:id",
    [
        auth,
        check("text", "Kreiraj komentar").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const user = await User.findById(req.user.id).select("-password");
            const post = await Post.findById(req.params.id);

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };

            post.comments.unshift(newComment);
            await post.save();
            res.json(post.comments);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server greška");
        }
    }
);

// @route   DELETE /posts/comment/:id/:comment_id
// @desc    Delete a comment
// @access  Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // get a comment from the post, pull it out
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        // make sure it exists
        if (!comment) {
            return res.status(404).json({ msg: "Komentar ne postoji" });
        }
        // make sure the user deleting is the one that made it
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Korisnik nije autorizovan" });
        }
        // get the remove index 
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
        // remove the comment
        post.comments.splice(removeIndex, 1);
        await post.save();
        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server greška");
    }
});

module.exports = router;