const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const User = require("../models/User");

const router = express.Router();

/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // store uploaded files in the uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // use the original file name
  },
});

const upload = multer({ storage });



// user register
router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const profileImage = req.file;

    if (!profileImage) {
      return res.status(400).send("No file Uploaded");
    }

    const profileImagePath = profileImage.path;

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImagePath,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    return res.status(500).json({ message: "Registration failed!", error: err.message });
  }
});


// user login 
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).json({ message: "User doesn't exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!"})
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY)
    delete user.password

    return res.status(200).json({ token, user })
    
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: err.message })
  }
})


module.exports = router;
