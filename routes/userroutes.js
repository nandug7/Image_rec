/* // routes/userRoutes.js

const express = require('express');

const router = express.Router();
const userController = require('../controllers/usercontroller');

// ✅ Serve login page on '/'
router.get('/login', (req, res) => {
    res.render('user/pages/login', { error: null, email: '' });
  });
  
  // POST login data
  router.post('/login', userController.loginUser);
router.get('/signup', userController.getSignupPage); 
router.get('/homepage', userController.homepage);
router.post('/signup', userController.registerUser);



module.exports = router; */


const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const { isAuthenticated } = require('../middleware/auth'); // ✅ Import middleware

router.get('/login', (req, res) => {
  res.render('user/pages/login', { error: null, email: '' });
});

router.post('/login', userController.loginUser);

router.get('/signup', userController.getSignupPage);
router.post('/signup', userController.registerUser);

// ✅ Protect this route
router.get('/homepage', isAuthenticated, userController.homepage);

router.get('/logout', userController.logoutUser); // ✅ Logout route

module.exports = router;
