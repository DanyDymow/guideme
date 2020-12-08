const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');

const Point = require('../../models/Point');
const User = require('../../models/User');
const Trip = require('../../models/Trip');

// @route  POST api/points
// @desc   Create a point to some trip
// @access Private
router.post(
    '/:id',
    [
        auth,
        [
            check('coordX', 'Coordinate X is required')
                .not()
                .isEmpty(),
            check('coordY', 'Coordinate Y is required')
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
            const trip = await Trip.findById(req.params.id);

            const newPoint = new Point({
                coordX: req.body.coordX,
                coordY: req.body.coordY,
                user: req.user.id
            });

            console.log(newPoint);

            trip.points.unshift(newPoint);
            //await trip.save();
            //const point = await newPoint.save();
            res.json(trip);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route  DELETE api/points/:id/:point_id
// @desc   Delete point from a trip
// @access Private
router.delete('/points/:id/:point_id',
    auth,
    async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        //Pull out comment
        const point = trip.points.find(point => point.id === req.params.point_id);

        //Make sure comment exists
        if (!point) {
            return res.status(404).json({msg: 'Point doesn\'t exist'});
        }

        //Check user
        if (point.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'User not authorized'});
        }

        //Get remove index
        const removeIndex = trip.points
            .map(point => point.user.toString())
            .indexOf(req.user.id);

        trip.point.splice(removeIndex, 1);

        await trip.save();

        res.json(trip.points);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

