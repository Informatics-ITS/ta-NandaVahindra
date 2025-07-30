const { google } = require('googleapis');

// Load credentials from the service account JSON file
const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

// Authorize a client with credentials
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Create a Sheets API client
const sheets = google.sheets({ version: 'v4', auth });

module.exports = sheets;
