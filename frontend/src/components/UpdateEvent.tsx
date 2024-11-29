import { useState, useEffect } from "react";
import { updateEvent, Event, NewEvent } from "../services/api";
import { eventDateToHtmlInput } from "../modules/functions/eventHelperFunctions";

interface UpdateEventProps {
    onClose: () => void;
    onUpdateEvent: () => void;
    eventToEdit: Event; // Dogodek, ki ga urejamo
}

const emptyEvent: NewEvent = {
    name: "",
    description: "",
    date: "",
    location: "",
    organizer: ""
}

const UpdateEvent = ({ onClose, onUpdateEvent, eventToEdit }: UpdateEventProps) => {
    const [event, setEvent] = useState(emptyEvent);

    // Inicializiraj obrazec s podatki dogodka za urejanje
    useEffect(() => {
        if (eventToEdit) {
            setEvent({
                name: eventToEdit.name,
                description: eventToEdit.description,
                date: eventToEdit.date,
                location: eventToEdit.location,
                organizer: eventToEdit.organizer
            });
        }
    }, [eventToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEvent({
            ...event,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Posodabljam dogodek:", eventToEdit.id, event); // Dodan log
        const date = new Date(event.date);
        const savedEvent: NewEvent = {...event, date: date.toISOString()};
        await updateEvent(eventToEdit.id, savedEvent);
        onUpdateEvent();
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Ime dogodka</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={event.name}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <br />
            <div className="form-group">
                <label htmlFor="description">Opis</label>
                <textarea
                    id="description"
                    name="description"
                    value={event.description}
                    onChange={handleChange}
                    className="form-control"
                    rows={4}
                    required
                />
            </div>
            <br />
            <div className="form-group">
                <label htmlFor="date">Datum</label>
                <input
                    id="date"
                    type="datetime-local"
                    name="date"
                    value={eventDateToHtmlInput(event.date)}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <br />
            <div className="form-group">
                <label htmlFor="location">Lokacija</label>
                <input
                    id="location"
                    type="text"
                    name="location"
                    value={event.location}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
                Shrani Spremembe
            </button>
        </form>
    );
};

export default UpdateEvent;
