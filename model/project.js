const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  projectImg: {
    public_id: String,
    url: String,
  },
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
