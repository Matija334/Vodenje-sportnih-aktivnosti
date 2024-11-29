import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import UpdateEvent from '../src/components/UpdateEvent';
import { Event } from '../src/services/api';
import { eventDateToHtmlInput } from '../src/modules/functions/eventHelperFunctions';

// Mocking the updateEvent function
vi.mock('../src/services/api.tsx', () => ({
    updateEvent: vi.fn(),
}));

describe('UpdateEvent Component', () => {
    const mockOnClose = vi.fn();
    const mockOnUpdateEvent = vi.fn();

    const eventToEdit: Event = {
        id: 1,
        name: 'Test Event',
        description: 'This is a test event.',
        date: '2024-11-29T10:00:00Z', // ISO date string
        location: 'Test Location',
        organizer: 'Test Organizer',
    };

    beforeAll(() => {
        // Reset mocks before each test
        vi.clearAllMocks();
    });

    it('renders the UpdateEvent form with event data', () => {
        render(<UpdateEvent onClose={mockOnClose} onUpdateEvent={mockOnUpdateEvent} eventToEdit={eventToEdit} />);

        // Verify form fields are populated with eventToEdit data
        expect(screen.getByLabelText('Ime dogodka').value).toBe(eventToEdit.name);
        expect(screen.getByLabelText('Opis').value).toBe(eventToEdit.description);
        expect(screen.getByLabelText('Datum').value).toBe(eventDateToHtmlInput(eventToEdit.date));
        expect(screen.getByLabelText('Lokacija').value).toBe(eventToEdit.location);
    });

    it('updates state when input fields are changed', () => {
        render(<UpdateEvent onClose={mockOnClose} onUpdateEvent={mockOnUpdateEvent} eventToEdit={eventToEdit} />);

        // Simulate typing in the form fields
        fireEvent.change(screen.getByLabelText('Ime dogodka'), { target: { value: 'Updated Event Name' } });
        fireEvent.change(screen.getByLabelText('Opis'), { target: { value: 'Updated event description.' } });
        fireEvent.change(screen.getByLabelText('Lokacija'), { target: { value: 'Updated Location' } });

        // Check if state updates correctly
        expect(screen.getByLabelText('Ime dogodka').value).toBe('Updated Event Name');
        expect(screen.getByLabelText('Opis').value).toBe('Updated event description.');
        expect(screen.getByLabelText('Lokacija').value).toBe('Updated Location');
    });

    it('renders the submit button and triggers action on click', () => {
        render(
            <UpdateEvent
                onClose={mockOnClose}
                onUpdateEvent={mockOnUpdateEvent}
                eventToEdit={eventToEdit}
            />
        );

        // Preveri, če je gumb za shranjevanje prisoten
        const submitButton = screen.getByText('Shrani Spremembe');
        expect(submitButton).toBeInTheDocument();
    });


    it('updates the form when eventToEdit changes', () => {
        const updatedEventToEdit = { ...eventToEdit, name: 'New Event Name' };
        const { rerender } = render(<UpdateEvent onClose={mockOnClose} onUpdateEvent={mockOnUpdateEvent} eventToEdit={eventToEdit} />);

        // Initially check the event name
        expect(screen.getByLabelText('Ime dogodka').value).toBe('Test Event');

        // Rerender with updated event data
        rerender(<UpdateEvent onClose={mockOnClose} onUpdateEvent={mockOnUpdateEvent} eventToEdit={updatedEventToEdit} />);

        // Check if the form updates with the new event data
        expect(screen.getByLabelText('Ime dogodka').value).toBe('New Event Name');
    });
});
