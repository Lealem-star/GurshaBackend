const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  photo: {
    type: String, // URL or path to the photo/emoji
    required: true
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game' // Reference to the Game model
  }
}, { timestamps: true });

const Participant = mongoose.model('Participant', participantSchema);
module.exports = Participant;
