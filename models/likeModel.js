const mongoose = require("mongoose");

const likeSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  movieType: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Like", likeSchema);
