const express = require('express');
const router = express.Router();

const Listing = require('../models/listing');

router.get('/', async (req, res) => {
    try {
        const populatedListings = await Listing.find({}).populate('owner'); //will retrive all of the details of the listing's owner and add it instead of only relaying on the id 
        res.render('listings/index.ejs', {
            listings: populatedListings,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/new', async (req, res) => {
    res.render('listings/new.ejs');
});

router.post('/', async(req, res) => {
    req.body.owner = req.session.user._id; // will add owner to the request body, it will store the logged in user's id 
    await Listing.create(req.body);
    res.redirect('/listings'); //when redirecting it goes back to server.js, so you have to include the real path /listings
});

router.get('/:listingId', async (req, res) => {
    try {
        const listingId = req.params.listingId;
        const populatedListings = await Listing.findById(listingId).populate('owner'); //make sure to populate (extraxt details of the owner/user)
        const userHasFavourited = populatedListings.favouritedByUsers.some((user) =>
            user.equals(req.session.user._id)
        ); // checks if current user have favourited this listing or not (if it matched at least one user, it will return true, otherwise, false)
        res.render('Listings/show.ejs', {
            listing: populatedListings,
            userHasFavourited,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/'); //Home page
    }
});

router.delete('/:listingId', async (req, res) => {
    try {
        const listingId = req.params.listingId; // get the listing Id passed by the parameters
        const listing = await Listing.findById(listingId); // get the listing record from the DB

        if(listing.owner._id.equals(req.session.user._id)) { // checks if the requested session's user id (my current id) matches the owner's id
            await listing.deleteOne(); // deletes the record
            res.redirect('/listings'); // redirect the user to the display all listings page
        } else {
            res.send(`You don't have permission to do that.`);
        }
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/:listingId/edit', async (req, res) => {
    try {
        const listingId = req.params.listingId;
        const currentListing = await Listing.findById(listingId);
        res.render('listings/edit.ejs', {
            listing: currentListing,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.put('/:listingId', async (req, res) => {
    try {
        const listingId = req.params.listingId; // get the listing Id passed by the parameters
        const currentListing = await Listing.findById(listingId); // get the listing record from the DB

        if(currentListing.owner._id.equals(req.session.user._id)) { // checks if the requested session's user id (my current id) matches the owner's id
            await currentListing.updateOne(req.body); // updates the record, by sending the forms body
            res.redirect(`/listings/${listingId}`); // redirect the user to the show details page
        } else {
            res.send(`You don't have permission to do that.`);
        }
    } catch (error) {
       console.log(error);
       res.redirect('/'); 
    }
});

router.post('/:listingId/favourited-by/:userId', async (req, res) => {
    try {
        const listingId = req.params.listingId;
        const userId = req.params.userId;

        await Listing.findByIdAndUpdate(listingId, {
            $push: { favouritedByUsers: userId}, // since favouritedByUsers is an array we'll have to use push to add the passed user's parameter (my current user) to the favouritedByUsers array only (update it)
        });
        res.redirect(`/listings/${listingId}`);

    } catch (error) {
        console.log(error);
        res.redirect('/');

    }
});

router.delete('/:listingId/favourited-by/:userId', async (req, res) => {
    try {
        const listingId = req.params.listingId;
        const userId = req.params.userId;

        await Listing.findByIdAndUpdate(listingId, {
            $pull: { favouritedByUsers: userId }, // remove all user's record that match the passed parameter (current user user._id)
        });
        res.redirect(`/listings/${listingId}`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;

