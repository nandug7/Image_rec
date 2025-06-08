
const express = require('express');

exports.adminDashboard = (req, res) => {
    const users = [
        { id: 1, name: 'Alice', email: 'alice@example.com', role: 'user' },
        { id: 2, name: 'Bob', email: 'bob@example.com', role: 'admin' },
    ];

    // Dummy data for now
    const admin = { name: 'Admin User' };
    const totalUsers = users.length;
    const activeSessions = 5; // example static value
    const systemAlerts = 2;   // example static value

    res.render('admin/pages/admindashboard', {
        users,
        admin,
        totalUsers,
        activeSessions,
        systemAlerts
    });
};
