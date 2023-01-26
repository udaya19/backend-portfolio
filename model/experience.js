const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  logo: {
    public_id: String,
    url: String,
  },
});

const Experience = mongoose.model("Experience", experienceSchema);
module.exports = Experience;
