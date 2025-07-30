import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';

interface ActionSummaryProps {
  items: {
    image: string;
    title: string;
    number: string | number;
  }[];
}

export const ActionSummary: React.FC<ActionSummaryProps> = ({ items }) => {
  const theme = useTheme();
  const backgroundColor =
    theme.palette.mode === 'light' ? '{color[0]}' : '{color[1]}';
  const textColor = theme.palette.mode === 'light' ? 'grey.900' : 'white';

  return (
    <Card
      sx={{
        backgroundColor: backgroundColor,
        boxShadow: 5,
        borderRadius: 4,
        padding: 0,
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, textAlign: 'center' }}>
          Summary of Equipment Deployed in 2024
        </Typography>
        <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
          {items.map((item, index) => (
            <Box
              key={index}
              textAlign="center"
              sx={{
                flex: '1 1 calc(33.33% - 16px)', // Adjust for responsive layout
                maxWidth: '150px',
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: 'auto',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
              <Typography variant="subtitle1" sx={{ color: textColor, fontWeight: 'bold' }}>
                {item.title}
              </Typography>
              <Typography variant="body1" sx={{ color: textColor }}>
                {item.number}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
