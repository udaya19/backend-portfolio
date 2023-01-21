const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");

const { db } = require("./config/database");
const clodinaryConfig = require("./config/cloudinary");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/users", require("./routes/user"));
app.use("/api/about", require("./routes/about"));
app.use("/api/project", require("./routes/project"));
app.use("/api/education", require("./routes/education"));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Port running on port ${port}`);
});
