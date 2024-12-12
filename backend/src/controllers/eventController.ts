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

    addComment: (req: Request, res: Response) => {
        const { eventId, userId, comment } = req.body;

        db.run(
            `INSERT INTO comments (event_id, user_id, comment) VALUES (?, ?, ?)`,
            [eventId, userId, comment],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ id: this.lastID, message: 'Komentar dodan.' });
            }
        );
    },

    getComments: (req: Request, res: Response) => {
        const { eventId } = req.params;

        db.all(
            `SELECT c.id, c.comment, c.timestamp, u.username 
             FROM comments c 
             JOIN users u ON c.user_id = u.id 
             WHERE c.event_id = ?`,
            [eventId],
            (err, rows) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(200).json(rows);
            }
        );
    },

    deleteComment: (req: Request, res: Response) => {
        const { id } = req.params;

        db.run(`DELETE FROM comments WHERE id = ?`, [id], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Komentar ni najden.' });
            }
            res.status(200).json({ message: 'Komentar izbrisan.' });
        });
    },

    rateEvent: (req: Request, res: Response): void => {
        const { eventId, userId, rating } = req.body;

        if (rating < 1 || rating > 5) {
            res.status(400).json({ error: "Ocena mora biti med 1 in 5." });
            return;
        }

        db.run(
            `INSERT INTO event_ratings (event_id, user_id, rating)
             VALUES (?, ?, ?)
                 ON CONFLICT(event_id, user_id) 
         DO UPDATE SET rating = ?`,
            [eventId, userId, rating, rating],
            function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.status(200).json({ message: "Ocena uspešno shranjena." });
            }
        );
    },

    getEventRating: (req: Request, res: Response): void => {
        const { eventId } = req.params;

        db.get(
            `SELECT id FROM events WHERE id = ?`,
            [eventId],
            (err, eventRow) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }

                if (!eventRow) {
                    res.status(404).json({ error: "Dogodek ni najden." });
                    return;
                }

                db.get(
                    `SELECT AVG(rating) as averageRating
                 FROM event_ratings
                 WHERE event_id = ?`,
                    [eventId],
                    (err, row: { averageRating: number } | undefined) => {
                        if (err) {
                            res.status(500).json({ error: err.message });
                            return;
                        }
                        res.json({ averageRating: row?.averageRating || 0 });
                    }
                );
            }
        );
    },

};
