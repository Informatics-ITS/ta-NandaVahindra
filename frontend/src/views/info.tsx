// InfoContent.js
// import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const InfoPage = () => {
  return (
    <Box
      sx={{
        py: 3,
        textAlign: 'left',
        px: 3,
      }}
    >
      <Typography variant="h4" component="h2">
        Information Page
      </Typography>
      <Typography variant="body1">
        On development.
      </Typography>
      {/* Add more content related to the Info page here */}
    </Box>
  );
};
