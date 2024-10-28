const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

const app = express();
const port = 3000;
const usersFile = path.join(__dirname, 'data', 'users.json');
const logsFolder = path.join(__dirname, 'logs');

// Ensure the logs folder exists
if (!fs.existsSync(logsFolder)) {
    fs.mkdirSync(logsFolder);
}

// Ensure the users file exists
if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([]));
}

app.use(bodyParser.json());
app.use(express.static('public'));

// Configure Passport.js
passport.use(new GoogleStrategy({
    // Google OAuth configuration
    clientID: 'login-authenticate-426017',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // Google OAuth authentication callback
    // Implement your authentication logic here
  }
));


passport.use(new GitHubStrategy({
    // GitHub OAuth configuration
    clientID: 'Ov23liOeIXb9UrokDcWGD',
    clientSecret: 'e7f3a1b01125d1e86b59c8952ebd9d8cf87470f5',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // GitHub OAuth authentication callback
    // Implement your authentication logic here
  }
));

// Express routes
app.get('/', (req, res) => {
    // Home page route
});

// Google OAuth route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to success page or set up session
    res.redirect('/success');
  });

// GitHub OAuth route
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback route
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to success page or set up session
    res.redirect('/success');
  });

// Helper function to read users from file
function readUsers() {
    const usersData = fs.readFileSync(usersFile);
    return JSON.parse(usersData);
}

// Helper function to write users to file
function writeUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Helper function to log login attempts
function logLoginAttempt(username, success) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} - Username: ${username} - Success: ${success}\n`;
    const logFilePath = path.join(logsFolder, 'login_attempts.log');
    fs.appendFileSync(logFilePath, logEntry, 'utf8');
}

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();

    if (users.find(user => user.username === username)) {
        res.json({ success: false, message: 'Username already exists' });
    } else {
        users.push({ username, password });
        writeUsers(users);
        res.json({ success: true });
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        logLoginAttempt(username, true);
        res.json({ success: true });
    } else {
        logLoginAttempt(username, false);
        const userExists = users.some(user => user.username === username);
        if (userExists) {
            res.json({ success: false, message: 'Invalid username or password' });
        } else {
            res.json({ success: false, message: 'You haven\'t registered. Please register yourself first.' });
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
