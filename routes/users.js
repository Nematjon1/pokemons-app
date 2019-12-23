const express = require("express");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const router = express.Router();

const User = require("../models/User");

// @route   POST /api/users
// @desc    register a user
// @access  Public
router.post("/", [
  check("name", "Name is required")
    .not()
    .isEmpty(),
  check("email", "Please provide a valid email").isEmail(),
  check("password", "Please enter 6 or more characters").isLength({
    min: 6
  })
], async (req,res) => {
  const errors = validationResult(req.body);
  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if(user) {
      return res.status(400).json({msg: "User already exists"});
    }

    user = new User({
      name,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(payload, config.get("jwtSecret"), {
      expiresIn: 360000
    }, (err, token) => {
      if(err) throw err;
      res.json({token})
    })
  } catch(err) {
    console.error(err.message);
    res.status(500).send("Server error")
  }
});

module.exports = router;
