const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const { isAuthenticated } = require('../middleware/auth'); // ✅ Import middleware
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory buffer

router.get('/login', (req, res) => {
  res.render('user/pages/login', { error: null, email: '' });
});

router.post('/login', userController.loginUser);

router.get('/signup', userController.getSignupPage);
router.post('/signup', userController.registerUser);

// ✅ Protect this route
router.get('/homepage', userController.homepage);

router.get('/logout', userController.logoutUser); // ✅ Logout route
router.post('/upload', isAuthenticated, upload.single('billFile'), userController.uploadBill);
router.get('/dashboard', isAuthenticated, userController.getDashboard);


module.exports = router;
