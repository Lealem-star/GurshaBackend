const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://meseretlealem8:uIuJQZYOFLHhubMG@cluster0.ysox9oa.mongodb.net/gursha?retryWrites=true&w=majority';

        // Avoid reconnecting if already connected
        if (mongoose.connection.readyState >= 1) {
            console.log('🔁 Reusing existing MongoDB connection');
            return;
        }

        console.log('Attempting to connect to MongoDB...');
        console.log('URI:', mongoUri);

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'gursha',
        });

        const db = mongoose.connection;
        console.log('✅ MongoDB connected');
        console.log('Database name:', db.name);
        console.log('Database host:', db.host);
        console.log('Database port:', db.port);

    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        } else {
            console.log('⚠️  Continuing in development mode without DB...');
        }
    }
};

module.exports = connectDB;
