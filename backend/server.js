require('dotenv').config();
const express = require('express');
const cors = require('cors');  // Import the CORS middleware
const app = express();
const spreadsheetRoutes = require('./routes/spreadsheetRoutes');
const otherRoutes = require('./routes/otherRoutes'); // Import other routes
const authenticateJWT = require('./middleware/authMiddleware');
// const { promisify } = require('util');
// require('./config/redisClient'); // Initialize Redis client

app.use(cors());
app.use(express.json());


// Load routes
// app.use('/api/auth', authRoutes);
app.use('/api/other', otherRoutes); // Use other routes
app.use('/api', authenticateJWT.verifyToken, spreadsheetRoutes); // Protect spreadsheet routes with JWT auth
// app.use('/api', spreadsheetRoutes);
const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});  