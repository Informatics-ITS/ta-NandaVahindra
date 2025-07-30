// api/monthsService.ts
import axios from 'axios';
import { API_BASE_URL } from './config';
import { auth } from '../firebase';

interface monthsData{
    month: string;
    opex: number;
    revenue: number;
    profitability: number;
    payload: number;
    user: number;
}

interface data {
    region: string;
    months: monthsData[];
}

export interface GraphData {
    status: string;
    data: data[];
}

export const fetchGraphData = async (): Promise<GraphData> => {
    
    const user = auth.currentUser;

    if (!user) {
        console.error("fetchAction Error: No user is signed in.");
        throw new Error("User not authenticated. Cannot fetch actions.");
    }

    let token: string;

    try {
        console.log("fetchAction: Getting Firebase ID token...");
        token = await user.getIdToken();
        console.log("fetchAction: Token retrieved.");
    } catch (error) {
        console.error("fetchAction Error: Failed to get Firebase ID token:", error);
        // Throw an error if token retrieval fails
        throw new Error("Failed to retrieve authentication token.");
    }
    try {
        const response = await axios.get<GraphData>(`${API_BASE_URL}/graphData`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching graph Data:', error);
        throw error;
    }
};