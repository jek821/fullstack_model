const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const classifyRoute = require('./routes/classify');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use('/classify', classifyRoute);


// Catch-all for unhandled routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
