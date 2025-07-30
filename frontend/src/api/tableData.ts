// api/eventsService.ts (atau path yang sesuai)
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from './config'; // Pastikan path ini benar
import { auth } from '../firebase'; // Pastikan path ini benar

// --- NEW: Interface for nested metric objects ---
export interface Metric {
    baseline: string | null;
    event: string | null;
    delta: string | null;
}

// --- UPDATED: Event interface to use the new Metric type ---
export interface Event {
    id: string | null;
    name: string;
    startDate: string | null;
    endDate: string | null;
    payload: Metric; // Updated from string | null
    revenue: Metric; // Updated from string | null
    user: Metric;    // Updated from string | null
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
}

// Struktur respons API yang diharapkan
export interface EventsApiResponse {
    status: string; // "success" atau "error"
    data: Event[];
    pagination: Pagination;
    message?: string; // Pesan opsional, terutama untuk error
}

// Parameter untuk fungsi fetch kita
export interface FetchEventsParams {
    currentPage: number;
    itemsPerPage: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    searchQuery?: string; // Query pencarian opsional
}

export const fetchEventsData = async (
    params: FetchEventsParams
): Promise<{ events: Event[], pagination: Pagination }> => {
    // Destructure semua parameter, termasuk searchQuery
    const { currentPage, itemsPerPage, sortBy, sortOrder, searchQuery } = params;

    const currentUser = auth.currentUser;
    if (!currentUser) {
        console.error("fetchEventsData Error: no user is signed in.");
        throw new Error("Unauthenticated user. Cannot fetch events.");
    }

    let token: string;
    try {
        token = await currentUser.getIdToken();
    } catch (error) {
        console.error("fetchEventsData Error: Failed to get Firebase ID token:", error);
        throw new Error("Failed to get authentication token.");
    }

    try {
        // console.log(`Fetching events with params:`, params);

        // Bangun objek parameter untuk Axios, hanya sertakan searchQuery jika ada nilainya
        const requestParams: any = {
            page: currentPage,
            limit: itemsPerPage,
            sortBy: sortBy,
            sortOrder: sortOrder,
        };

        if (searchQuery && searchQuery.trim() !== '') {
            requestParams.searchQuery = searchQuery;
        }

        const response = await axios.get<EventsApiResponse>(`${API_BASE_URL}/tableData`, {
            params: requestParams,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.data && response.data.status === 'success') {
            return {
                events: response.data.data || [],
                pagination: response.data.pagination || { currentPage: 1, totalPages: 1, totalItems: 0, limit: itemsPerPage },
            };
        } else {
            console.error('fetchEventsData Error: API response was not successful or format is wrong', response.data);
            throw new Error(response.data.message || 'Failed to fetch events due to an API error.');
        }

    } catch (error) {
        const axiosError = error as AxiosError<EventsApiResponse>;
        console.error('Error fetching event data:', axiosError);

        if (axiosError.response) {
            console.error('Error data:', axiosError.response.data);
            console.error('Error status:', axiosError.response.status);
            throw new Error(axiosError.response.data.message || `Server error: ${axiosError.response.status}`);
        } else if (axiosError.request) {
            console.error('Error request:', axiosError.request);
            throw new Error('No response from server. Please check your network connection.');
        } else {
            console.error('Error message:', axiosError.message);
            throw new Error(axiosError.message || 'An unexpected error occurred while fetching events.');
        }
    }
};
