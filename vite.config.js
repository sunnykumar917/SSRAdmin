// vite.config.js
export default {
  server: {
    host: '0.0.0.0',  // Make sure the server listens on all network interfaces
    allowedHosts: ['ssradmin.onrender.com', 'localhost'],  // Allow your Render hostname and localhost
    port: process.env.PORT || 3000  // Use the port environment variable or fallback to 3000
  }
}
