// controllers/userController.js

const express = require('express');
const User = require('../models/usermodel');
const bcrypt = require('bcrypt');
const path = require('path');
const Bill = require('../models/billmodel');
const Tesseract = require('tesseract.js');
const { extractTotalAndCategory } = require('../utils/parser');
const mongoose = require('mongoose');





exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received login input:", { email, password });

    if (!email || !password) {
      console.log("Missing fields");
      return res.render('user/pages/login', {
        error: 'All fields are required',
        email
      });
    }

    const user = await User.findOne({ email });
    console.log("User from DB:", user);

    if (!user) {
      console.log("User not found in DB");
      return res.render('user/pages/login', {
        error: 'User not found',
        email
      });
    }

    if (user.status === 'blocked') {
      console.log("Blocked user attempted login");
      return res.render('user/pages/login', {
        error: 'Your account has been blocked. Please contact admin.',
        email
      });
    }

    console.log("Comparing passwords...");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.render('user/pages/login', {
        error: 'Invalid password',
        email
      });
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
        return res.render('user/pages/login', {
          error: 'Session error. Please try again.',
          email
        });
      }

      console.log("Login successful, redirecting...");
      res.redirect('/user/');
    });

  } catch (error) {
    console.error("🔥 Unexpected Login Error:", error);
    res.render('user/pages/login', {
      error: '🔥 Unexpected error during login: ' + error.message,
      email: req.body.email
    });
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
    res.redirect('/user/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

exports.uploadBill = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    console.log('Running OCR...');
     const { data: { text } } = await Tesseract.recognize(
    req.file.buffer,
    'eng',
    { logger: m => console.log(m) }
  );
    console.log('Extracted text:', text);

    const { totalAmount, category } = extractTotalAndCategory(text);
    console.log('Parsed totalAmount:', totalAmount, 'Category:', category);

const bill = new Bill({
  userId: req.session.user.id,
  filename: req.file.originalname,
  fileType: req.file.mimetype,
  fileData: req.file.buffer,
  extractedText: text,
  totalAmount: totalAmount || null,
  category: category || 'Other'
});

    await bill.save();

    res.redirect('/user/dashboard');

  } catch (error) {
    console.error('Error uploading & extracting:', error);
    res.status(500).send('Error processing file');
  }
};








exports.getDashboard = async (req, res) => {
  try {
    const userId = req.session.user.id;

    // 1️⃣ Fetch all bills for user
    const bills = await Bill.find({ userId }).sort({ createdAt: -1 });
    // 2️⃣ Calculate total per category
    const categoryTotals = {}; // { Housing: 1234, Food: 567 }

    let grandTotal = 0;

    bills.forEach(bill => {
      const cat = bill.category || 'Uncategorized';
      const amt = bill.totalAmount || 0;

      if (!categoryTotals[cat]) {
        categoryTotals[cat] = 0;
      }

      categoryTotals[cat] += amt;
      grandTotal += amt;
    });

    console.log('📊 Category Totals:', categoryTotals);
    console.log('💰 Grand Total:', grandTotal);

    res.render('user/pages/dashboard', {
      session: req.session,
      bills,
      categoryTotals,
      grandTotal
    });

  } catch (err) {
    console.error('❌ Dashboard error:', err);
    res.status(500).send('Server error');
  }
};


exports.getReport = async (req, res) => {
  try {
    const userId = req.session.user.id;

    // 1️⃣ Total spend per category for pie chart
    const categoryTotals = await Bill.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: "$totalAmount" }
        }
      },
      { $sort: { totalSpent: -1 } }
    ]);

    // 2️⃣ Month-wise spend per category
    const monthWise = await Bill.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            category: "$category"
          },
          totalSpent: { $sum: "$totalAmount" }
        }
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month"
          },
          categories: {
            $push: {
              category: "$_id.category",
              totalSpent: "$totalSpent"
            }
          },
          monthTotal: { $sum: "$totalSpent" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    // 3️⃣ Year-wise spend per category
    const yearWise = await Bill.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            category: "$category"
          },
          totalSpent: { $sum: "$totalAmount" }
        }
      },
      {
        $group: {
          _id: "$_id.year",
          categories: {
            $push: {
              category: "$_id.category",
              totalSpent: "$totalSpent"
            }
          },
          yearTotal: { $sum: "$totalSpent" }
        }
      },
      { $sort: { "_id": -1 } }
    ]);

    res.render('user/pages/report', {
      session: req.session,
      categoryTotals,
      monthWise,
      yearWise
    });

  } catch (err) {
    console.error('❌ Report error:', err);
    res.status(500).send('Server error');
  }
};


// exports.listUsers = async (req, res) => {
//   try {
    
//     res.render('admin/pages/users');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server Error');
//   }
// };