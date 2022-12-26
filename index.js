const express = require("express");
const app = express();

app.use(express.json());
app.use("/api/users", require("./routes/user"));

const port = 3001;
app.listen(port, () => {
  console.log(`Port running on port ${port}`);
});
