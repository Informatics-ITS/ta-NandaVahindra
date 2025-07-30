
// api/monthsService.ts
import axios from 'axios';
import { API_BASE_URL } from './config';
import { auth } from '../firebase';

export interface EventsRegionCJData {
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

export const fetchEventsRegionCJ = async (month: string, category: string, action: string): Promise<EventsRegionCJData> => {
    
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
        const response = await axios.get<EventsRegionCJData>(`${API_BASE_URL}/eventsCJRegion`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            params: {
                month: month || undefined,
                category: category || undefined,
                action: action || undefined,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching events regoin center java data:', error);
        throw error;
    }
};
