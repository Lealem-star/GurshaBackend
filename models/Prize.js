const mongoose = require('mongoose');

const prizeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    // required: true // Remove required constraint
  },
  image: {
    type: String // URL or path to the prize image
  }
}, { timestamps: true });

const Prize = mongoose.model('Prize', prizeSchema);
module.exports = Prize;
