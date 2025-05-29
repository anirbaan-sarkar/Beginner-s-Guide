const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from .env file
dotenv.config();

const publicRoutes = require('./routes/public'); // Import public routes

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

// Mongoose connection
if (!DB_CONNECTION_STRING) {
  console.error('Error: DB_CONNECTION_STRING is not defined in your .env file');
  process.exit(1); // Exit the application if DB connection string is not found
}

mongoose.connect(DB_CONNECTION_STRING)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the application on connection error
  });

mongoose.connection.on('error', err => {
  console.error('MongoDB runtime error:', err);
});

// Mount routes
app.use('/api', publicRoutes); // Mount public API routes

// Basic root route (can be removed or changed later)
app.get('/', (req, res) => {
  res.send('Hello World! Welcome to the Beginner\'s Guide API.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
