const mongoose = require("mongoose");
const educationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  year: {
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

const Education = mongoose.model("Education", educationSchema);
module.exports = Education;
