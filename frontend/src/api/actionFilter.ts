// api/monthsService.ts
import axios from 'axios';
import { API_BASE_URL } from './config';
import { auth } from '../firebase';


export interface ActionOption {
    value: string;
    label: string;
}

export const fetchAction = async (): Promise<ActionOption[]> => {
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
        const response = await axios.get<{ data: string[] }>(`${API_BASE_URL}/actions`, {
            headers: {
                'Authorization': `Bearer ${token}`,  // Include the token in the Authorization header
            },
        });
        
        return response.data.data.map((actionName: string) => {
            return {
                value: actionName,
                label: actionName,
            };
        });
    } catch (error) {
        console.error('Error fetching action:', error);
        throw error;
    }
};