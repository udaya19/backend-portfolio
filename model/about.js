const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
});

const About = mongoose.model("About", aboutSchema);
module.exports = About;
