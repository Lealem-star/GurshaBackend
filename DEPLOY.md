# Vercel Deployment Guide

## Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`

## Environment Variables
Set these environment variables in your Vercel dashboard:

```
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_2024
MONGODB_URI=mongodb+srv://meseretlealem8:oCqluaVBJKgTowHM@cluster0.pv9y913.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

## Deployment Steps
1. Run `vercel` in the project directory
2. Follow the prompts to link your project
3. Deploy with `vercel --prod`

## Configuration
- The app is configured as a serverless function
- CORS is set up for production origins
- Database connections are optimized for serverless
- Admin user (username: admin, password: admin123) is auto-created

## API Endpoints
- `GET /api/auth/test` - Health check
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

## Troubleshooting
- Check Vercel function logs for errors
- Verify environment variables are set correctly
- Ensure MongoDB connection string is valid