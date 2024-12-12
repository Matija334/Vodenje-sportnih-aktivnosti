import axios from "axios";
import { API_URL } from "./apiConstants";

const eventsUrl = API_URL+"/events";

export interface NewEvent {
    name: string;
    description: string;
    date: string;
    location: string;
    organizer: string;
}

export interface Event extends NewEvent {
    id: number;
}

export interface User {
    id: number;
}

export const addEvent = async (event: NewEvent): Promise<Event | undefined> => {
    try {
        const response = await axios.post<Event>(eventsUrl, event);
        return response.data;
    } catch (error) {
        console.error("Napaka pri dodajanju dogodka:", error);
    }
};

export const getAllEvents = async (): Promise<Event[] | undefined> => {
    try {
        const response = await axios.get<Event[]>(eventsUrl);
        return response.data;
    } catch (error) {
        console.error("Napaka pri pridobivanju dogodkov:", error);
    }
};

export const deleteEvent = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${eventsUrl}/${id}`);
    } catch (error) {
        console.error("Napaka pri brisanju dogodka:", error);
    }
};
//update
export const updateEvent = async (id: number, updatedEvent: Omit<Event, "id">): Promise<void> => {
    try {
        console.log("Posodabljam dogodek z ID:", id, "s podatki:", updatedEvent);
        const response = await axios.put<Event>(`${eventsUrl}/${id}`, updatedEvent);
        console.log("Odgovor strežnika:", response.data);
    } catch (error) {
        console.error("Napaka pri posodabljanju dogodka:", error);
    }
};

// Prijava na dogodek
export const registerForEvent = async (eventId: number, userId: number): Promise<void> => {
    try {
        const response = await axios.post(`${API_URL}/events/register`, { eventId, userId });
        console.log("Registration successful:", response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error("Error registering for event:", error.response.data);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error setting up request:", error.message);
            }
        } else {
            console.error("Unexpected error:", error);
        }
    }
};

export const deregisterFromEvent = async (eventId: number, userId: number): Promise<void> => {
    try {
        const response = await axios.post(`${eventsUrl}/deregister/${eventId}`, { userId });
        console.log("Odjava iz dogodka uspešna:", response.data);
    } catch (error) {
        console.error("Napaka pri odjavi iz dogodka:", error);
    }
};


// Funkcija za pridobivanje obvestil uporabnika
export const getUserNotifications = async (userId: number): Promise<string[] | undefined> => {
    try {
        const response = await axios.get<string[]>(`${API_URL}/events/notifications/${userId}`);
        // Vrnemo seznam obvestil
        console.log("opravljen apiklic")
        return response.data;
    } catch (error) {
        console.error("Napaka pri pridobivanju obvestil:", error);
        return undefined;  // Če pride do napake, vrnemo undefined
    }
};
