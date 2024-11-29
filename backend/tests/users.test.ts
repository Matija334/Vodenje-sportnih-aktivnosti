const request = require('supertest');
import db from '../src/config/database';
const app = require('../app');

describe('Users API', () => {
    beforeAll((done) => {
        db.serialize(() => {
            db.run(
                `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          password TEXT NOT NULL,
          fullName TEXT NOT NULL,
          role TEXT NOT NULL
        );`
            );

            db.run(
                `CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          date TEXT NOT NULL,
          location TEXT,
          organizer TEXT NOT NULL
        );`
            );

            done();
        });
    });
    beforeEach((done) => {
        db.serialize(() => {
            db.run('DELETE FROM users');
            db.run('DELETE FROM sqlite_sequence WHERE name="users"');

            db.run(
                `INSERT INTO users (username, password, fullName, role)
         VALUES ('testUser', 'password123', 'Test User', 'user')`,
                done
            );
        });
    });

    afterAll((done) => {
        db.close(done);
    });

    it('GET /api/users - should return all users', async () => {
        const response = await request(app).get('/api/users');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([
            {
                id: 1,
                username: 'testUser',
                password: 'password123',
                fullName: 'Test User',
                role: 'user',
            },
        ]);
    });

    it('POST /api/users - should add a new user', async () => {
        const newUser = {
            username: 'newUser',
            password: 'newPassword',
            fullName: 'New User',
            role: 'admin',
        };

        const response = await request(app).post('/api/users').send(newUser);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');

        const usersResponse = await request(app).get('/api/users');
        expect(usersResponse.body.length).toBe(2);
        expect(usersResponse.body[1]).toMatchObject(newUser);
    });

    it('PUT /api/users/:id - should update an existing user', async () => {
        const updatedUser = {
            username: 'updatedUser',
            password: 'updatedPassword',
            fullName: 'Updated User',
            role: 'admin',
        };

        const response = await request(app).put('/api/users/1').send(updatedUser);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Uporabnik posodobljen!');

        const usersResponse = await request(app).get('/api/users');
        expect(usersResponse.body[0]).toMatchObject(updatedUser);
    });

    it('DELETE /api/users/:id - should delete a user', async () => {
        const response = await request(app).delete('/api/users/1');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Uporabnik uspešno izbrisan');

        const usersResponse = await request(app).get('/api/users');
        expect(usersResponse.body).toEqual([]);
    });
});
