const express = require("express");
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// Load User Model
const User = require("../../models/User");


// @route   GET api/Users/test
// @desc    Tests Users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route   GET api/Users/register
// @desc    Register User
// @access  Public
router.post("/register", (req, res) => {
	User.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			return res.status(400).json({ email: "Email already exsists" });
		} else {
      const avatar = gravatar.url(req.body.email, {
        s: 200, // Size
        r: 'pg', // rating
        d: 'mm' // Default avatar
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err))
        })
      })
    }
	})
});

module.exports = router;
