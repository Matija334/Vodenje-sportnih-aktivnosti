const request = require('supertest');
const app = require('../app');
import db from '../src/config/database';

describe('Events API', () => {
    beforeAll((done) => {
        db.serialize(() => {
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
            db.run('DELETE FROM events');
            db.run('DELETE FROM sqlite_sequence WHERE name="events"');
            db.run(
                `INSERT INTO events (name, description, date, location, organizer)
         VALUES ('Test Event', 'Description', '2024-12-01T12:00:00Z', 'Online', 'Test Organizer')`,
                done
            );
        });
    });

    afterAll((done) => {
        db.close(done);
    });

    it('GET /api/events - should return all events', async () => {
        const response = await request(app).get('/api/events');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([
            {
                id: 1,
                name: 'Test Event',
                description: 'Description',
                date: '2024-12-01T12:00:00Z',
                location: 'Online',
                organizer: 'Test Organizer',
            },
        ]);
    });

    it('POST /api/events - should add a new event', async () => {
        const newEvent = {
            name: 'Hackathon',
            description: '24-hour coding event',
            date: '2024-12-15T09:00:00Z',
            location: 'Campus',
            organizer: 'FERI Crew',
        };

        const response = await request(app).post('/api/events').send(newEvent);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');

        const eventsResponse = await request(app).get('/api/events');
        expect(eventsResponse.body.length).toBe(2);
    });

    it('PUT /api/events/:id - should update an existing event', async () => {
        const updatedEvent = {
            id: 1,
            name: 'Updated Event',
            description: 'Updated Description',
            date: '2024-12-01T12:00:00Z',
            location: 'Updated Location',
            organizer: 'Updated Organizer',
        };
        const response1 = await request(app).get('/api/events');
        console.log(response1.body);

        const response = await request(app).put('/api/events/1').send(updatedEvent);
        console.log(response.body)
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Dogodek posodobljen in obvestila poslata!');
    });

    it('DELETE /api/events/:id - should delete an event', async () => {
        const response = await request(app).delete('/api/events/1');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Dogodek uspešno izbrisan');

        const eventsResponse = await request(app).get('/api/events');
        expect(eventsResponse.body).toEqual([]);
    });

    it('POST /api/events/register - should register a user for an event', async () => {
        db.run(
            `INSERT INTO users (username, password, fullName, role)
       VALUES ('testUser', 'password123', 'Test User', 'user')`
        );

        const registration = { eventId: 1, userId: 1 };
        const response = await request(app).post('/api/events/register').send(registration);
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Prijava uspešna');
    });

    it('POST /api/events/deregister/:eventId - should deregister a user from an event', async () => {
        db.run(
            `INSERT INTO registrations (event_id, user_id) VALUES (1, 1)`
        );

        const deregistration = { userId: 1 };
        const response = await request(app).post('/api/events/deregister/1').send(deregistration);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Odjava uspešna');
    });
});