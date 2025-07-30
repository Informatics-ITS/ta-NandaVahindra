// api/monthsService.ts
import axios from 'axios';
import { API_BASE_URL } from './config';
import { auth } from '../firebase';

export interface CategoryOption {
    value: string;
    label: string;
}

export const fetchCategory = async (): Promise<CategoryOption[]> => {
    
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
        const response = await axios.get<{ data: string[] }>(`${API_BASE_URL}/categories`, {
            headers: {
                'Authorization': `Bearer ${token}`,  // Include the token in the Authorization header
            },
        });
        
        return response.data.data.map((categoryName: string) => {
            return {
                value: categoryName,
                label: categoryName,
            };
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        throw error;
    }
};
