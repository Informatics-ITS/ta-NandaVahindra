// api/monthsService.ts
import axios from 'axios';
import { API_BASE_URL } from './config';
import { auth } from '../firebase';

export interface EventsRegionBNData {
    status: string;
    data: {
        eventCounts: number;
        totals: {
            opex: number;
            revenue: number;
            revenueGrowth: number;
            profitability: number;
            payload: number;
            payloadGrowth: number;
            user: number;
            userGrowth: number;
        };
    };
}

export const fetchEventsRegionBN = async (month: string, category: string, action: string): Promise<EventsRegionBNData> => {
    
    const user = auth.currentUser;

    if (!user) {
        console.error("fetchAction Error: No user is signed in.");
        throw new Error("User not authenticated. Cannot fetch actions.");
    }

    let token: string;

    try {
        console.time("fetchToken"); // Start timing the token retrieval
        console.log("fetchAction: Getting Firebase ID token...");
        token = await user.getIdToken();
        console.log("fetchAction: Token retrieved.");
        console.timeEnd("fetchToken"); // End timing the token retrieval
    } catch (error) {
        console.error("fetchAction Error: Failed to get Firebase ID token:", error);
        // Throw an error if token retrieval fails
        throw new Error("Failed to retrieve authentication token.");
    }

    try {
        console.time("fetchAPI"); // Start timing the API request
        const response = await axios.get<EventsRegionBNData>(`${API_BASE_URL}/eventsBNRegion`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            params: {
                month: month || undefined,
                category: category || undefined,
                action: action || undefined,
            },
        });
        console.timeEnd("fetchAPI"); // End timing the API request
        return response.data;
    } catch (error) {
        console.error('Error fetching events regoin bali nusra data:', error);
        throw error;
    }
};