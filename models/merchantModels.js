const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: [true, "Please enter the merchant's latitude"]
  },
  longitude: {
    type: Number,
    required:[true, "Please enter the merchant's longitude"]
  },
  merchantId: {
    type: Number,
    required: [true, "Please enter the merchant's Id"],
    unique: true
  },
  merchantName: {
    type: String,
    required: [true, "Please enter the merchant's Name"]
  },

});

const Merchant = mongoose.model('Merchant', merchantSchema);

module.exports = Merchant


