// This file can be used for more complex configuration management if needed.
// For now, environment variables are loaded using dotenv in server.js.

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  // Add other configurations here as the project grows
};

module.exports = config;
