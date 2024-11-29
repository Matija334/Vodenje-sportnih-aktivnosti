import { Request, Response } from 'express';

import db from "../config/database";

export const usersController = {
    add: (req: Request, res: Response) => {
        const { username, password, fullName, role } = req.body;
        db.run(
            `INSERT INTO users (username, password, fullName, role) VALUES (?, ?, ?, ?)`,
            [username, password, fullName, role],
            function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(201).json({ id: this.lastID });
                }
            }
        );
    },

    getAll: (req: Request, res: Response) => {
        db.all("SELECT * FROM users", [], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(rows);
            }
        });
    },

    delete: (req: Request, res: Response) => {
        const { id } = req.params;
        db.run(
            `DELETE FROM users WHERE id = ?`,
            [id],
            function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ message: "Uporabnik uspešno izbrisan" });
                }
            }
        );
    },

    update: (req: Request, res: Response) => {
        const { id } = req.params;
        const { username, password, fullName, role } = req.body;
        db.run(
            `UPDATE users SET username = ?, password = ?, fullName = ?, role = ? WHERE id = ?`,
            [username, password, fullName, role, id],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message }); // Napaka pri posodobitvi
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Uporabnik ni najden' }); // Če ID ne obstaja
                }
                res.status(200).json({ message: 'Uporabnik posodobljen!', id }); // Uspešna posodobitev
            }
        );
    },

    login: (req: Request, res: Response) => {
        const { username, password } = req.body;
        db.all("SELECT * FROM users WHERE username=? AND password=? LIMIT 1", [username, password], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                if(!rows[0])
                    res.status(400).json({ error: "Wrong credentials" });

                res.status(200).json(rows[0]);
            }
        });
    },
};
