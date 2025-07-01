const User = require('../models/usermodel');
const Bill = require('../models/billmodel');


// Dashboard with some metrics (already done)
exports.adminDashboard = async (req, res) => {
  try {
    const users = await User.find();
    const admin = { name: 'Admin User' };
    const totalUsers = users.length;
    const activeSessions = 5;
    const systemAlerts = 2;
     const totalFiles = await Bill.countDocuments();  

    res.render('admin/pages/admindashboard', {
      users,
      admin,
      totalUsers,
      activeSessions,
      totalFiles,
      systemAlerts
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// ✅ List all users (could be a separate view or reuse dashboard)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.render('admin/pages/users', { users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// ✅ Render form to edit a user
exports.editUserForm = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.render('admin/pages/editUser', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// ✅ Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email, role });
    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// ✅ Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// ✅ Block user
exports.blockUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: 'blocked' });
    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// ✅ Unblock user
exports.unblockUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: 'active' });
    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
