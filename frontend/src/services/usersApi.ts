import axios from "axios";
import { API_URL } from "./apiConstants";

const usersUrl = API_URL+"/users";

export enum UserRole {
    MANAGEMENT = "management",
    EMPLOYEE = "employee",
    UNASSIGNED = "unassigned"
}

export interface User {
    username: string, 
    password: string, 
    fullName: string, 
    role: UserRole
}

export interface UserWithId extends User {
    id: number;
}

export const addUser = async (user: User): Promise<number | undefined> => {
    try {
        const response = await axios.post<number>(usersUrl, user);
        return response.data;
    } catch (error) {
        console.error("Napaka pri dodajanju uporabnika:", error);
    }
};

export const getAllUsers = async (): Promise<UserWithId[] | undefined> => {
    try {
        const response = await axios.get<UserWithId[]>(usersUrl);
        return response.data;
    } catch (error) {
        console.error("Napaka pri pridobivanju uporabnikov:", error);
    }
};

export const deleteUser = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${usersUrl}/${id}`);
    } catch (error) {
        console.error("Napaka pri brisanju uporabnika:", error);
    }
};

export const updateUser = async (id: number, user: User): Promise<void> => {
    try {
        console.log("Posodabljam uporabnika z ID:", id, "s podatki:", user);
        const response = await axios.put<UserWithId>(`${usersUrl}/${id}`, user);
        console.log("Odgovor strežnika:", response.data);
    } catch (error) {
        console.error("Napaka pri posodabljanju uporabnika:", error);
    }
};

export const loginUser = async (username: string, password: string): Promise<UserWithId | undefined> => {
    try {
        const response = await axios.post<UserWithId>(`${usersUrl}/login`, {username: username, password: password});
        if(response.status === 200)
            return response.data;
            
        return undefined;
    } catch (error) {
        console.error("Napaka pri prijavi uporabnika:", error);
    }
};
