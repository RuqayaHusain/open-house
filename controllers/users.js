const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');

router.get('/profile', async (req, res) => {
    try {
        const myListings = await Listing.find({ // get all the listings created by current user
            owner: req.session.user._id,
        }).populate('owner');

        const myFavouriteListings = await Listing.find({
            favouritedByUsers: req.session.user._id,
        }).populate('owner');

        res.render('users/show.ejs', {
            myListings,
            myFavouriteListings,
        });

    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;