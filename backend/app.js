const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const classifyRoute = require('./routes/classify');

require('dotenv').config({ path: './backend/.env' });



const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API Routes
app.use('/classify', classifyRoute);

// Catch-all route for serving the frontend's index.html
// This ensures Vue/React SPA routes work properly
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Catch-all for unhandled routes (non-frontend)
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
