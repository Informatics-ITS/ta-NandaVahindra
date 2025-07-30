// api/monthsService.ts
import axios from 'axios';
import { API_BASE_URL } from './config';
import { auth } from '../firebase';


export const clearCache = async () => {
    const user = auth.currentUser;

    if (!user) {
        console.error("clearCache Error: No user is signed in.");
        throw new Error("User not authenticated. Cannot clear cache.");
    }

    let token: string;

    try {
        console.log("clearCache: Getting Firebase ID token...");
        token = await user.getIdToken();
        console.log("clearCache: Token retrieved.");
    } catch (error) {
        console.error("clearCache Error: Failed to get Firebase ID token:", error);
        // Throw an error if token retrieval fails
        throw new Error("Failed to retrieve authentication token.");
    }
    try {
        const response = await axios.post(`${API_BASE_URL}/clearCache`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error clearing cache:', error);
        throw error;
    }
}