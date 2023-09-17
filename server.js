const dotenv = require("dotenv").config();
const express = require("express");
const connectDb = require("./config/dbConnection");
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
const path = require('path')

connectDb();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use("/users", require("./routes/userRoutes"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
