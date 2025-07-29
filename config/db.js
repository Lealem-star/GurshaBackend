const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Check if already connected (important for serverless)
        if (mongoose.connection.readyState === 1) {
            console.log('✅ Using existing MongoDB connection');
            return;
        }

        // Check if MONGODB_URI is defined, use fallback for development
        const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://meseretlealem8:uIuJQZYOFLHhubMG@cluster0.ysox9oa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

        console.log('Attempting to connect to MongoDB...');
        
        // Optimized connection options for serverless
        const options = {
            bufferCommands: false, // Disable mongoose buffering
            bufferMaxEntries: 0, // Disable mongoose buffering
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4 // Use IPv4, skip trying IPv6
        };

        await mongoose.connect(mongoUri, options);
        console.log('✅ MongoDB connected successfully');

        // Test the connection only in development
        if (process.env.NODE_ENV !== 'production') {
            const db = mongoose.connection;
            console.log('Database name:', db.name);
            console.log('Database host:', db.host);
            console.log('Database port:', db.port);
        }

    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.error('Please check if MongoDB is running and the connection string is correct');

        // For serverless, don't exit the process, just throw the error
        if (process.env.NODE_ENV === 'production') {
            throw error;
        } else {
            console.log('⚠️  Continuing in development mode without database...');
        }
    }
};

module.exports = connectDB;
