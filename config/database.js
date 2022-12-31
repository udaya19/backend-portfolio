const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/portfolio");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error in connecting database"));
db.once("open", () => console.log("Connected to database"));
module.exports = db;
