const express = require("express");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
const path = require('path')

connectDb();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname + "/public")))
app.use("/users", require("./routes/userRoutes"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});