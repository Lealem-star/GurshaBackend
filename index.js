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
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? ['https://gursha-frontend.vercel.app'] 
    : ['https://gursha-frontend.vercel.app', 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('🚫 CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['X-CSRF-Token', 'Authorization', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version']
}));

// Handle preflight requests
app.options('*', cors());

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path} - Origin: ${req.get('origin') || 'none'}`);
    next();
});

// Ensure database connection for each request (important for serverless)
app.use(async (req, res, next) => {
    try {
        await initializeDB();
        next();
    } catch (error) {
        console.error('Database initialization failed:', error);
        res.status(500).json({ 
            message: 'Database connection failed',
            error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message 
        });
    }
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory');
}

app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database connection
let dbConnected = false;

const initializeDB = async () => {
    if (dbConnected) return;
    
    try {
        await connectDB();
        // Call the createAdminUser function after DB connection is established
        await createAdminUser();
        dbConnected = true;
        console.log('🚀 Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
    }
};

// Initialize DB for serverless
initializeDB().catch(console.error);

// Use routes
app.get('/', (req, res) => {
    res.send('Hello World')
});
app.use('/api/auth', authRoutes);
app.use('/api/', adminRoutes);
app.use('/api', userRoutes);
app.use('/api', gameRoutes);
app.use('/api', participantRoutes);
app.use('/api', prizeRoutes);

// Export the app as a serverless function for Vercel
module.exports = app;

// Start the server only in development
if (process.env.NODE_ENV !== 'production' && require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
