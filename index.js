require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db'); // Database configuration
const adminRoutes = require('./routes/AdminRoutes'); // Admin routes
const userRoutes = require('./routes/UserRoutes');
const gameRoutes = require('./routes/GameRoutes');
const participantRoutes = require('./routes/ParticipantRoutes');
const prizeRoutes = require('./routes/PrizeRoutes');
const authRoutes = require('./routes/auth'); // Authentication routes
const { createAdminUser } = require('./scripts/createAdmin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = ['https://gursha-frontend.vercel.app'];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['X-CSRF-Token', 'Authorization', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version']
}));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory');
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB and create admin user
connectDB().then(() => {
    // Call the createAdminUser function after DB connection is established
    createAdminUser().catch(error => {
        console.error('Error creating admin user:', error);
    });
}).catch(error => {
    console.error('Failed to connect to database:', error);
});

// Use routes
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Ensure unique route prefixes to avoid conflicts
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // Changed to /api/admin
app.use('/api/users', userRoutes); // Changed to /api/users
app.use('/api/games', gameRoutes); // Changed to /api/games
app.use('/api', participantRoutes); // Changed to /api/participants
app.use('/api/prizes', prizeRoutes); // Changed to /api/prizes

// Export the app as a serverless function
module.exports = app;

// Start the server only if running locally (not in serverless)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
