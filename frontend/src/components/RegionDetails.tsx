import React from 'react';
// Removed Paper, IconButton, CloseIcon, SxProps, Theme as they are handled by the Dialog in Dashboard.tsx
// Removed duplicate React import below
import { Typography, Box } from '@mui/material';

// --- 1. Define the shape of the detailed data ---
// Adjust these properties based on your actual data structure
interface RegionData {
    totalSales: string;       // e.g., "Rp 15.000.000"
    activeBranches: number;   // e.g., 150
    keyMetric: string;        // e.g., "Overall Performance: Good"

}

// --- 2. Define the props for the RegionDetails component ---
interface RegionDetailsProps {
    /** The name of the region being displayed */
    region: string; 
    /** The detailed data object for the selected region. Can be undefined if data isn't available yet. */
    data?: RegionData | undefined | null;
    /** Function to call when the details view should be closed (now handled by Dialog, but kept for potential future use) */
    onClose: () => void;
    // sx prop removed as styling/container is handled by Dialog
}

// --- 3. Functional RegionDetails Component in TSX ---
// Removed sx from props destructuring
const RegionDetails: React.FC<RegionDetailsProps> = ({ region, data, onClose }) => {
    // Explicitly mark onClose as unused to satisfy TypeScript and ESLint
    void onClose;

    // Handle cases where data might not be available (e.g., loading or error)
    if (!data) {
        return (
            <Box sx={{ p: 1 }}>
                <Typography>Loading details for {region}...</Typography>
            </Box>
        );
    }

    // If data is available, destructure it
    const { totalSales, activeBranches, keyMetric } = data;

    return (
        <Box sx={{ p: 1 }}>
            <Box sx={{ mt: 1 }}>
                 <Typography variant="body1">Total Sales: {totalSales}</Typography>
                 <Typography variant="body1">Active Branches: {activeBranches}</Typography>
                 <Typography variant="body1">Key Metric: {keyMetric}</Typography>
            </Box>
        </Box>
    );
};

export default RegionDetails;
