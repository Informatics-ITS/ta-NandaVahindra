import { Card, CardContent, Typography, Box, useTheme, Divider } from '@mui/material';
import React from 'react';

interface DescValuePair {
    desc: string;
    value: React.ReactNode;
    growth?: React.ReactNode;
}

interface CardPrimaryProps {
    title: string;
    loc: string;
    descValues: DescValuePair[];  // Array of desc-value pairs
    color: Array<string>;
}

export const CardPrimary: React.FC<CardPrimaryProps> = ({ title, loc, descValues}) => {
    const theme = useTheme();
    const backgroundColor = theme.palette.mode === 'light' ? '{color[0]}' : '{color[1]}';
    const textColor = theme.palette.mode === 'light' ? 'grey.900' : 'white';

    return (
        <Card sx={{ backgroundColor: backgroundColor, boxShadow: 5, borderRadius: 4 }}>
            <CardContent>
                <Box>
                    <Typography component="div" sx={{ color: textColor }} fontWeight={'bold'} fontSize={20} textAlign={'center'}>
                        {title}
                    </Typography>
                    <Divider sx={{ backgroundColor: textColor, width:'90%', margin:'auto' }} />
                    <Typography variant="body1" sx={{ color: textColor }} textAlign={'center'} mb={2}>
                        {loc}
                    </Typography>

                    {/* Map through descValues to render each desc and value */}
                    {descValues.map((item, index) => (
                        <Box key={index}>  {/* Ensure each has a unique key */}
                            <Typography variant="body1" sx={{ color: textColor }} textAlign={'center'}>
                                {item.desc}
                                {item.growth && (
                                <Box
                                    component="span"
                                    sx={{
                                        color: item.growth && item.growth.toString().startsWith('+') ? 'green' : 'red',
                                        textAlign: 'center',
                                        display: 'inline',
                                    }}
                                >
                                    {item.growth}
                                </Box>
                            )}
                            </Typography>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    color: textColor, 
                                    textAlign: 'center', 
                                    fontWeight: 'bold', 
                                    fontSize: 40, 
                                    '&:hover': {
                                        cursor: 'pointer'
                                    } 
                                }}
                            >
                                {item.value}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};
