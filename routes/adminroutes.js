const express = require('express');

const router = express.Router();
const adminController = require('../controllers/admincontroller');



router.get('/dash', adminController.adminDashboard);

router.get('/users', adminController.listUsers);
router.get('/users/edit/:id', adminController.editUserForm);
router.post('/users/edit/:id', adminController.updateUser);
router.get('/users/delete/:id', adminController.deleteUser);
router.get('/users/block/:id', adminController.blockUser);
router.get('/users/unblock/:id', adminController.unblockUser);
module.exports = router;