const express = require("express");
const router = express.Router();
const {
  registerUser,
  currentUser,
  loginUser,
  saveMovie,
  getMovie,
  deleteMovie,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateToken");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/user", validateToken, currentUser);

router.post("/savemovie",validateToken, saveMovie);

router.get("/getmovie",validateToken, getMovie);
router.delete("/deletemovie",validateToken, deleteMovie);

module.exports = router;
