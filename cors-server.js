// cors-server.js
// ** NOTE: always run node cors-server.js first before npm run dev **

const express = require('express'); // Node.js framework
const cors = require('cors'); // middleware to handle CORS
const bodyParser = require('body-parser'); // parses json req

// Creating an instance of Express App
// Express App is a lightweight Node.js framework that acts as the main object
// allowing users to do routing, middlewares and configurations
// Express App was used to fix Cross Origin Resource Sharing errors when sending 
// API Requests to RestDB
const app = express();

// Middleware to enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());

// Proxy POST request to RestDB
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

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    // return a log message when the server runs sucessfully in debug console
    console.log(`CORS Proxy server is running on http://localhost:${PORT}`);
});
