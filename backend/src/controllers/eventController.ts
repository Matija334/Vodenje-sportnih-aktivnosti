import { Request, Response } from "express";
import db from "../config/database";

export const eventsController = {
    addEvent: (req: Request, res: Response) => {
        const { name, description, date, location, organizer } = req.body;

        db.run(
            `INSERT INTO events (name, description, date, location, organizer) VALUES (?, ?, ?, ?, ?)`,
            [name, description, date, location, organizer],
            function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(201).json({ id: this.lastID });
                }
            }
        );
    },

    getAllEvents: (req: Request, res: Response) => {
        db.all("SELECT * FROM events", [], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(rows);
            }
        });
    },

    deleteEvent: (req: Request, res: Response) => {
        const { id } = req.params;

        db.run(
            `DELETE FROM events WHERE id = ?`,
            [id],
            function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ message: "Dogodek uspešno izbrisan" });
                }
            }
        );
    },

    updateEvent: (req: Request, res: Response): void => {
        const { id } = req.params;
        const { name, description, date, location, organizer } = req.body;

        if (!name || !description || !date || !location || !organizer) {
            res.status(400).json({ error: "Vsi podatki so obvezni." });
            return; // Končaj funkcijo, brez vračanja vrednosti
        }

        db.run(
            `UPDATE events SET name = ?, description = ?, date = ?, location = ?, organizer = ? WHERE id = ?`,
            [name, description, date, location, organizer, id],
            function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return; // Končaj funkcijo tukaj
                }
                if (this.changes === 0) {
                    res.status(404).json({ error: "Dogodek ni najden" });
                    return;
                }

                db.all(
                    `SELECT user_id FROM Registrations WHERE event_id = ?`,
                    [id],
                    (err, rows) => {
                        if (err) {
                            res.status(500).json({ error: "Napaka pri pridobivanju uporabnikov" });
                            return;
                        }

                        const message = `Dogodek "${name}" je bil posodobljen.`;

                        (rows as { user_id: number }[]).forEach((row) => {
                            db.run(
                                `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
                                [row.user_id, message],
                                (err) => {
                                    if (err) {
                                        console.log("Napaka pri ustvarjanju obvestila:", err.message);
                                    }
                                }
                            );
                        });

                        res.status(200).json({ message: "Dogodek posodobljen in obvestila poslata!", id });
                    }
                );
            }
        );
    },


    getUserNotifications: (req: Request, res: Response) => {
        const { userId } = req.params;

        db.all(`SELECT message FROM notifications WHERE user_id = ?`, [userId], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: "Napaka pri pridobivanju obvestil" });
            }

            // Določimo natančen tip vrstic iz baze
            const messages = (rows as { message: string }[]).map((row) => row.message);

            res.json(messages); // Pošljemo seznam obvestil
        });
    },

    registerForEvent: (req: Request, res: Response) => {
        const { eventId, userId } = req.body;

        db.run(
            `INSERT INTO Registrations (event_id, user_id) VALUES (?, ?)`,
            [eventId, userId],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: "Napaka pri prijavi: " + err.message });
                }
                res.status(201).json({ message: 'Prijava uspešna', id: this.lastID });
            }
        );
    },

    deregisterFromEvent: (req: Request, res: Response) => {
        const { eventId } = req.params;
        const { userId } = req.body;

        db.run(
            `DELETE FROM Registrations WHERE event_id = ? AND user_id = ?`,
            [eventId, userId],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: 'Odjava uspešna' });
            }
        );
    },
};
