import 'dotenv/config';
const express = require('express');
import cors from 'cors';
import spreadsheetRoutes from '../routes/spreadsheetRoutes';
import otherRoutes from '../routes/otherRoutes';
import authenticateJWT from '../middleware/authMiddleware';


const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());

app.use('/api/other', otherRoutes);
app.use('/api', authenticateJWT.verifyToken, spreadsheetRoutes);

app.listen(8080, () => console.log("Server ready on port 8080."));

module.exports = app;