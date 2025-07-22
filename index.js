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

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory');
}

// Middleware
app.use(cors());
const cors = require('cors');

app.use(cors());

 app.use(cors({
   origin: 'http://gursha-backend.vercel.app'  //to be changed later to vercel url
 }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB and create admin user
connectDB().then(() => {
    // Call the createAdminUser function after DB connection is established
    try {
        createAdminUser();
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}).catch(error => {
    console.error('Failed to connect to database:', error);
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/', adminRoutes);
app.use('/api', userRoutes);
app.use('/api', gameRoutes);
app.use('/api', participantRoutes);
app.use('/api', prizeRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
