// cors-server.js
// ** NOTE: always run node cors-server.js first before npm run dev **

const express = require('express'); // Node.js framework
const cors = require('cors'); // middleware to handle CORS
const bodyParser = require('body-parser'); // parses json req
const session = require('express-session'); // add express sessions for session cookies
const crypto = require('crypto'); // For generating secure random secrets

// To generate random 10 character string for sessions secret
const SESSION_SECRET = crypto.randomBytes(10).toString('hex'); // using Node.js crypto module to generate secrets
console.log('Generated Session Secret:', SESSION_SECRET);

// Creating an instance of Express App
// Express App is a lightweight Node.js framework that acts as the main object
// allowing users to do routing, middlewares and configurations
// Express App was used to fix Cross Origin Resource Sharing errors when sending 
// API Requests to RestDB
const app = express();

// Middleware to enable CORS for all routes
app.use(
    cors({
        origin: ['http://localhost:5173', 'https://zhuang-zixian.github.io/FED_ASG2_MokeSell/'], // Allowed origins
        credentials: true, // Allow credentials (session cookies)
    })
);
app.use(bodyParser.json());

// Configure express-session middleware for implementing Session Cookies
// each user gets a session cookie called (connect.sid by default)
// use the network tab to ensure sessions are enforced
app.use(
    session({
        secret: SESSION_SECRET, // Replace with a generated key from login.js
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Set to true if using HTTPS only in production for example github pages
            httpOnly: true,
            maxAge: 1000 * 60 * 30, // 30 minutes
        },
    })
);

// Proxy POST request to RestDB rest/accounts collection
app.post('/rest/accounts', async (req, res) => {
    try {
        console.log('Incoming request body:', req.body); // Log the request body

        // Use fetch to forward the response back to RestDB within the "accounts" collection
        const response = await fetch('https://mokesell-6d16.restdb.io/rest/accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': '678a2a8729bb6d839ec56bd4', // Signup API key
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        console.log('RestDB response:', data); // Log the response from RestDB

        // If response status is not okay for example getting 400/500 HTTP errors log it and return back to debug console
        if (!response.ok) {
            console.error('Error response from RestDB:', data); // Log error details
            return res.status(response.status).json(data);
        }

        res.json(data); // Send the response from RestDB back to the client
    } catch (error) {
        console.error('Error from proxy server:', error.message); // Logging proxy server errors
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Proxy GET request to RestDB to rest/accounts collection
app.get('/rest/accounts', async (req, res) => {
    try {
        console.log('Incoming query:', req.query.q); // Log the query received

        const query = req.query.q ? `?q=${encodeURIComponent(req.query.q)}` : '';
        const response = await fetch(`https://mokesell-6d16.restdb.io/rest/accounts${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': '678a2a8729bb6d839ec56bd4', // API key
            },
        });

        const data = await response.json();
        console.log('RestDB response:', data); // Log the response

        if (!response.ok) {
            console.error('Error from RestDB:', data);
            return res.status(response.status).json(data);
        }

        // Save user data in session on successful login as session cookies
        if (data.length > 0) {
            req.session.user = {
                id: data[0]._id,
                username: data[0].username,
                email: data[0].useremail,
            };
            console.log('Session created:', req.session.user);
        }

        res.json(data);
    } catch (error) {
        console.error('Error in GET proxy:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// /current-user end point to dynamically fetch the logged in user to display in
// index.html or other pages on the navigation bar
app.get('/current-user', (req, res) => {
    // Check if there's a session and a 'user' object
    if (req.session && req.session.user) {
      // Return user info
      return res.json({
        loggedIn: true, // is loggedIn is returned true only if user is logged in
        user: req.session.user,
      });
    } else {
      // Not logged in
      return res.status(401).json({
        loggedIn: false,
        message: 'Not logged in',
      });
    }
  });  

// Logout route to destroy session for the user and clear the session cookie
app.post('/logout', (req, res) => {
    if (req.session) {
        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Failed to log out.' });
            }

            // Clear the session cookie
            res.clearCookie('connect.sid', {
                path: '/',
                httpOnly: true,
                secure: false, // Set to true if using HTTPS in production
            });

            // Respond to the client
            res.json({ message: 'You have been logged out successfully.' });
        });
    } else {
        res.status(400).json({ message: 'No active session to log out.' });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    // return a log message when the server runs sucessfully in debug console
    console.log(`CORS Proxy server is running on http://localhost:${PORT}`);
});
