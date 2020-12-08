const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');

const Trip = require('../../models/Trip');
const User = require('../../models/User');

// @route  POST api/trips
// @desc   Create a trip
// @access Private
router.post(
    '/',
    [
        auth,
        [
            check('title', 'Title is required')
                .not()
                .isEmpty(),
            check('description', 'Description is required')
                .not()
                .isEmpty(),
            check('price', 'Price is required')
                .not()
                .isEmpty(),
            check('photos', 'Photos is required')
                .not()
                .isEmpty(),

        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            const newTrip = new Trip({
                title: req.body.title,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
                description: req.body.description,
                price: req.body.price,
                photos: req.body.photos
            });

            const trip = await newTrip.save();
            res.json(trip);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route  GET api/trips
// @desc   Get all trips
// @access Private
router.get('/', auth, async (req, res) => {
    try {
        const trips = await Trip.find().sort({date: -1});
        res.json(trips);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  GET api/trips/:id
// @desc   Get trip by id
// @access Private
router.get('/:id', auth, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({msg: 'Post not found'});
        }

        res.json(trip);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({msg: 'Trip not found'});
        }
        res.status(500).send('Server Error');
    }
});

// @route  DELETE api/trips/:id
// @desc   Delete a trip by id
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        //Check if post exist
        if (!trip) {
            return res.status(404).json({msg: 'Trip not found'});
        }

        //Check user
        if (trip.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'User not authorized'});
        }

        await trip.remove();

        res.json({msg: 'Trip removed'});
    } catch (err) {
        console.error(err.message);
        //Even if tripId is not valid
        if (err.kind === 'ObjectId') {
            return res.status(404).json({msg: 'Trip not found'});
        }
        res.status(500).send('Server Error');
    }
});

// @route  PUT api/trips/like/:id
// @desc   Like a trip
// @access Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        //Check if the trip has already been liked
        if (trip.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({msg: 'Post already liked'});
        }

        trip.likes.unshift({user: req.user.id});

        await trip.save();

        res.json(trip.likes);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({msg: 'Trip not found'});
        }
        res.status(500).send('Server Error');
    }
});

// @route  PUT api/trips/unlike/:id
// @desc   Unlike a trip
// @access Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        //Check if the post has already been liked
        if (trip.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({msg: 'Trip has not yet been liked'});
        }

        //Get remove index
        const removeIndex = trip.likes.map(like => like.user.toString()).indexOf(req.user.id);

        trip.likes.splice(removeIndex, 1);

        await trip.save();

        res.json(trip.likes);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({msg: 'Trip not found'});
        }
        res.status(500).send('Server Error');
    }
});

// @route  POST api/trips/comment/:id
// @desc   Comment on a trip
// @access Private
router.post(
    '/comment/:id',
    [
        auth,
        [
            check('text', 'Text is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        try {
            const user = await User.findById(req.user.id).select('-password');
            const trip = await Trip.findById(req.params.id);

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };

            trip.comments.unshift(newComment);

            await trip.save();

            res.json(trip.comments);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route  DELETE api/trips/comment/:id/:comment_id
// @desc   Delete comment from a trip
// @access Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        //Pull out comment
        const comment = trip.comments.find(comment => comment.id === req.params.comment_id);

        //Make sure comment exists
        if (!comment) {
            return res.status(404).json({msg: 'Comment doesn\'t exist'});
        }

        //Check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'User not authorized'});
        }

        //Get remove index
        const removeIndex = trip.comments
            .map(comment => comment.user.toString())
            .indexOf(req.user.id);

        trip.comments.splice(removeIndex, 1);

        await trip.save();

        res.json(trip.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
