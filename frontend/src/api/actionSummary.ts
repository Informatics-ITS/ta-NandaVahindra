// api/monthsService.ts
import axios from 'axios';
import { API_BASE_URL } from './config';
import { auth } from '../firebase';

export interface ActionSummaryData {
    status: string;
    data: {
        AddNe: number,
        CMON: number,
        Combat: number,
        easymacro: number,
        massivemimo: number,
        repeater: number,
        optim: number,
    };
}

export const fetchActionSummary = async (): Promise<ActionSummaryData> => {
    
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
        const response = await axios.get<ActionSummaryData>(`${API_BASE_URL}/actionSummary`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching action summary data:', error);
        throw error;
    }
};