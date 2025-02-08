// cors-server.js
// ** NOTE: always run node cors-server.js first before npm run dev **

const express = require('express'); // Node.js framework
const cors = require('cors'); // middleware to handle CORS
const bodyParser = require('body-parser'); // parses json req
const session = require('express-session'); // add express sessions for session cookies
const crypto = require('crypto'); // For generating secure random secrets
const mailjet = require('node-mailjet'); // For Newsletter section to send news letter through mailjet API

// To generate random 10 character string for sessions secret
const SESSION_SECRET = crypto.randomBytes(10).toString('hex'); // using Node.js crypto module to generate secrets
console.log('Generated Session Secret:', SESSION_SECRET);

// Creating an instance of Express App
// Express App is a lightweight Node.js framework that acts as the main object
// allowing users to do routing, middlewares and configurations
// Express App was used to fix Cross Origin Resource Sharing errors when sending 
// API Requests to RestDB
const app = express();

// Middleware to prevent caching
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    next();
});

// Middleware to enable CORS for all routes
app.use(
    cors({
        origin: ['http://localhost:5173', 'https://zhuang-zixian.github.io/FED_ASG2_MokeSell/'], // Allowed origins
        credentials: true, // Allow credentials (session cookies)
        exposedHeaders: ["x-apikey"], // Allow API key in headers
    })
);

// JSON parsing is enabled
app.use(express.json());
// app.use(bodyParser.json()); //deprecated

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

// Middleware to clear stale cookies when the server starts (works only in development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        if (!req.session.user) {
            res.clearCookie('connect.sid', {
                path: '/',
                httpOnly: true,
                secure: false, // Set to true for HTTPS in production
            });
        }
        next();
    });
}

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

// PATCH request to update user profile in RestDB
app.patch('/update-profile', async (req, res) => {
    try {
        const { username, email, newUsername, newEmail, newPassword } = req.body;

        // Must provide at least one to identify the user
        if (!username && !email) {
            return res.status(400).json({ message: "Error: old username or old email is required." });
        }

        // 1) Look up the user in RestDB by existing username/email
        let searchQuery = `q={"$or":[{"username":"${username}"}, {"useremail":"${email}"}]}`;
        const searchURL = `https://mokesell-6d16.restdb.io/rest/accounts?${searchQuery}`;
        
        console.log("Searching for user with query:", searchQuery);
        
        const searchResponse = await fetch(searchURL, {
            method: "GET",
            headers: {
                "x-apikey": "678a2a8729bb6d839ec56bd4",
                "Content-Type": "application/json",
            },
        });
        
        if (!searchResponse.ok) {
            return res.status(500).json({ message: "Error fetching user data from RestDB." });
        }
        
        const users = await searchResponse.json();
        console.log("Found users:", users);

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "User not found in RestDB." });
        }

        const userRecord = users[0]; 
        const userId = userRecord._id;

        // 2) Validate new username/email uniqueness
        let updateData = {};

        if (newUsername || newEmail) {
            // Check if the new username OR email already exist (for a different _id)
            let checkQueryParts = [];
            if (newUsername) checkQueryParts.push(`{"username":"${newUsername}"}`);
            if (newEmail)    checkQueryParts.push(`{"useremail":"${newEmail}"}`);

            let checkQuery = `q={"$or":[${checkQueryParts.join(",")}]}`;
            const checkURL = `https://mokesell-6d16.restdb.io/rest/accounts?${checkQuery}`;
            console.log("Checking if new username/email already exists:", checkQuery);

            const checkResponse = await fetch(checkURL, {
                method: "GET",
                headers: {
                    "x-apikey": "678a2a8729bb6d839ec56bd4",
                    "Content-Type": "application/json",
                },
            });

            const existingUsers = await checkResponse.json();
            // If found a record that is not the current user
            if (existingUsers.length > 0 && existingUsers[0]._id !== userId) {
                return res.status(400).json({
                    message: "Error: New username or email is already taken."
                });
            }
        }

        if (newUsername) updateData.username = newUsername;
        if (newEmail)    updateData.useremail = newEmail;

        // 3) Hash the new password ONCE on the server
        if (newPassword) {
            // Using Node 'crypto' for hashing
            const hashedPw = crypto.createHash('sha256')
                                   .update(newPassword)
                                   .digest('hex');
            updateData.userpassword = hashedPw;
        }

        // If no fields, bail out
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update." });
        }

        console.log("Updating user ID:", userId, "with data:", updateData);

        // 4) Send the PATCH to RestDB
        const updateResponse = await fetch(`https://mokesell-6d16.restdb.io/rest/accounts/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": "678a2a8729bb6d839ec56bd4",
            },
            body: JSON.stringify(updateData),
        });

        if (!updateResponse.ok) {
            const errJson = await updateResponse.json();
            return res.status(updateResponse.status).json({
                message: "Update failed",
                error: errJson
            });
        }

        const updatedUser = await updateResponse.json();
        console.log("RestDB PATCH response:", updatedUser);

        // 5) Update session if there's a new username/email
        if (req.session && req.session.user) {
            if (newUsername) req.session.user.username = newUsername;
            if (newEmail)    req.session.user.email = newEmail;
        }

        return res.json({ message: "Profile updated successfully!", data: updatedUser });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
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
      // Clear cookie if no valid session
      res.clearCookie('connect.sid', {
          path: '/',
          httpOnly: true,
          secure: false, // Set to true for HTTPS
      });
      // Not logged in
      return res.status(401).json({
        loggedIn: false,
        message: 'Session Expired. Please log in again',
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
  
  // Mailjet API to send newsletter to users
  const MJ_APIKEY_PUBLIC = '041f8eb310e0ab5db8c2833bf3947079';
  const MJ_APIKEY_PRIVATE = '3de5c1362cbd8b33e8d042c0fffd8404';
  const mailjetClient = mailjet.apiConnect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);

  app.post('/api/newsletter', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        // Replace with your verified "From" address in Mailjet
        const fromEmail = "mokesellstore@gmail.com"; 
        const fromName = "My Newsletter";

        const request = await mailjetClient.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: {
                        Email: fromEmail,
                        Name: fromName
                    },
                    To: [
                        {
                            Email: email
                        }
                    ],
                    Subject: "Thanks for signing up!",
                    TextPart: "Welcome to our newsletter!",
                    HTMLPart: "<h3>Thanks for subscribing!</h3><p>We'll keep you updated!</p>"
                }
            ]
        });

        console.log("Mailjet response:", request.body);
        res.json({ message: "Confirmation email sent to " + email });
    } catch (error) {
        console.error("Mailjet error:", error);
        res.status(500).json({ message: "Error sending email" });
    }
});

// Save voucher to RestDB
app.post("/save-voucher", async (req, res) => {
    try {
        const { user, discount, code } = req.body;

        if (!user) {
            return res.status(401).json({ message: "Error: User not logged in." });
        }

        const response = await fetch("https://mokesell-6d16.restdb.io/rest/voucher", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": "678a2a8729bb6d839ec56bd4", // Replace with your RestDB API Key
            },
            body: JSON.stringify({ user, discount, code }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error("Failed to save voucher");

        res.json({ message: "Voucher saved successfully!", data });

    } catch (error) {
        console.error("Error saving voucher:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    // return a log message when the server runs sucessfully in debug console
    console.log(`CORS Proxy server is running on http://localhost:${PORT}`);
});
