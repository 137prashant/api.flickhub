const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Like = require("../models/likeModel");

// Register a user
// POST users/register
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  console.log("req.body", req.body);
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  console.log("userAvailabble", userAvailable);
  if (userAvailable) {
    res.status(201).json("exist");
    throw new Error("User are already registered, please do Login");
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password: ", hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  console.log(`User created ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  res.json({ message: "Register the user" });
});

//Login user
//POST /users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT
      // { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(201).json("notlogin");
    throw new Error("email or password is not valid");
  }
});

//Current user info
//POST /users/current
const currentUser = asyncHandler(async (req, res) => {
  console.log("currentUser ", req.user.id);
  res.status(200).json(req.user);
});

// save user email and user like movie id
// POST users/movieId
const saveMovie = asyncHandler(async (req, res) => {
  const { movieId, movieType } = req.body;
  if ((movieId, movieType)) {
    const userLike = await Like.create({
      userId: req.user.email,
      movieId,
      movieType,
    });
    console.log("userlike", userLike);
    res.status(201).json({ userLike });
  } else {
    res.status(400);
    throw new Error("Like data is not valid");
  }
});

// GET users/movieId
const getMovie = asyncHandler(async (req, res) => {
  try {
    const likedMovie = await Like.find({ userId: req.user.email });
    res.status(200).json({ likedMovie });
    console.log("likedmovie", likedMovie);
  } catch (error) {
    console.error("Error retrieving liked movies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const deleteMovie = asyncHandler(async (req, res) => {
  try {
    const { movieId, movieType } = req.body;
    console.log("req.querry", req.body);
    const userId = req.user.email;
    console.log("userrrrid", userId);
    await Like.findOneAndDelete({ userId, movieId, movieType });
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  saveMovie,
  getMovie,
  deleteMovie,
};
