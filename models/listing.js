const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  size: {
    type: Number,
    required: true,
    min: 0,
  },
  owner: { //store the objectId of the owner of the 1 - many assocation, which in this case the 1 User
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // model name
  },
  favouritedByUsers: [ // will add all users (since we can have multiple users that favourited this listing)
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
