import { useState } from "react";
import { addEvent, NewEvent } from "../services/api";
import { signedInUserAtom } from "../atoms/signedInUserAtom";
import { useAtom } from "jotai";
import { UserRole } from "../services/usersApi";

interface AddEventProps {
    onClose: () => void;
    onAddEvent: () => void;
}

const emptyEvent: NewEvent = {
    name: "",
    description: "",
    date: "",
    location: "",
    organizer: ""
}

const AddEvent = ({ onClose, onAddEvent }: AddEventProps) => {
    const [signedInUser] = useAtom(signedInUserAtom);
    const [event, setEvent] = useState(emptyEvent);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEvent({
            ...event,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!signedInUser || signedInUser.role!==UserRole.MANAGEMENT) {
            console.error("Unauthorized. To add event, you have to be logged in as management.")
            return;
        }

        const date = new Date(event.date);
        const savedEvent: NewEvent = {...event, date: date.toISOString(), organizer: signedInUser.fullName};
        await addEvent(savedEvent);
        setEvent(emptyEvent);
        onAddEvent();
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Ime dogodka</label>
                <input
                    type="text"
                    name="name"
                    value={event.name}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <br/>
            <div className="form-group">
                <label htmlFor="description">Opis</label>
                <textarea
                    name="description"
                    value={event.description}
                    onChange={handleChange}
                    className="form-control"
                    rows={4}
                    required
                />
            </div>
            <br/>
            <div className="form-group">
                <label htmlFor="date">Datum</label>
                <input
                    type="datetime-local"
                    name="date"
                    value={event.date}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <br/>
            <div className="form-group">
                <label htmlFor="location">Lokacija</label>
                <input
                    type="text"
                    name="location"
                    value={event.location}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary mt-3">Dodaj Dogodek</button>
        </form>
    );
};

export default AddEvent;