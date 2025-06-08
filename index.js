const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/smartapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Session middleware
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const userRoutes = require('./routes/userroutes');
const adminRoutes = require('./routes/adminroutes');
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
