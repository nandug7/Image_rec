// controllers/userController.js

const express = require('express');
const User = require('../models/usermodel');
const bcrypt = require('bcrypt');
const path = require('path');



exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received login input:", { email, password });

    if (!email || !password) {
      console.log("Missing fields");
      return res.send('All fields are required');
    }

    const user = await User.findOne({ email });
    console.log("User from DB:", user);

    if (!user) {
      console.log("User not found in DB");
      return res.send('User not found');
    }

    console.log("Comparing passwords...");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.send('Invalid password');
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    console.log("Session about to be saved:", req.session.user);

    req.session.save(err => {
      if (err) {
        console.error("Session save error:", err);
        return res.send("Session error");
      }

      console.log("Login successful, redirecting...");
      res.redirect('/user/homepage');
    });

  } catch (error) {
    console.error("🔥 Unexpected Login Error:", error);
    res.send("🔥 Unexpected error during login: " + error.message);
  }
};




exports.logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(500).send("Logout failed");
    }
    res.redirect('/user/login'); // Go back to login 
  });
};





// controllers/userController.js

// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   console.log("hellooo");
//   if (!email || !password) {
//     return res.render('user/pages/login', {
//       error: 'All fields are required',
//       email,
//     });
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.render('user/pages/login', {
//         error: 'User not found',
//         email,
//       });
//       console.log("not found");
      
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.render('user/pages/login', {
//         error: 'Invalid password',
//         email,
//       });
//     }
//     console.log("vanu vanuuu");
    
//     // Successful login
//     res.redirect('/user/homepage');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server error');
//   }
// };


exports.getSignupPage = (req, res) => {
    res.render('user/pages/signup'); // It will render views/user/signup.ejs
};

exports.homepage = (req, res) => {
  if (!req.session.user) {
    return res.redirect('/user/login'); // Redirect if not logged in
  }

  res.render('user/pages/homepage', {
    session: req.session // ✅ Pass session to EJS
  });
};




exports.getSignupPage = (req, res) => {
  res.render('user/pages/signup'); // Adjust if path differs
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, repassword } = req.body;

    // Server-side validation
    if (!name || !email || !password || password !== repassword) {
      return res.status(400).send('Invalid input or passwords do not match');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Redirect to login page after successful registration
    res.redirect('/user');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
