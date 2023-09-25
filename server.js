const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const app = express();
const port = 3000; // Change this to your desired port
const User = require('./models/user'); // Create a 'user' model using Mongoose

// Connect to MongoDB (you need to have MongoDB installed and running)
mongoose.connect('mongodb://localhost/ewaste_locator', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Configure express-session and passport
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local strategy for authentication
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect username.' });
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the E-Waste Facility Locator!');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.send('Welcome to the dashboard!');
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
