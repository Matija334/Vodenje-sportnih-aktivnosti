import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import EventDetails from '../src/components/EventDetails';
import { Event } from '../src/services/api';

// Ustvari primer dogodka za testiranje
const mockEvent: Event = {
    id: 1,
    name: 'Test Event',
    description: 'This is a test event.',
    date: '2024-11-29T10:00:00Z', // datum v ISO formatu
    location: 'Test Location',
    organizer: 'Test Organizer',
};

describe('EventDetails Component', () => {

    // Mockiranje funkcije alert
    beforeAll(() => {
        globalThis.alert = vi.fn(); // Mockiranje alert funkcije
    });

    it('renders event details correctly', () => {
        render(<EventDetails event={mockEvent} />);

        // Preveri, če so vsi podatki o dogodku pravilno prikazani
        expect(screen.getByText('Ime dogodka:')).toBeInTheDocument();
        expect(screen.getByText(mockEvent.name)).toBeInTheDocument();
        expect(screen.getByText('Opis:')).toBeInTheDocument();
        expect(screen.getByText(mockEvent.description)).toBeInTheDocument();
        expect(screen.getByText('Datum:')).toBeInTheDocument();
        expect(screen.getByText('29.11.2024 ob 11:00')).toBeInTheDocument(); // Preveri, če je datum pravilen
        expect(screen.getByText('Lokacija:')).toBeInTheDocument();
        expect(screen.getByText(mockEvent.location)).toBeInTheDocument();
        expect(screen.getByText('Organizator:')).toBeInTheDocument();
        expect(screen.getByText(mockEvent.organizer)).toBeInTheDocument();
    });

    it('copies event link to clipboard on share button click', async () => {
        render(<EventDetails event={mockEvent} />);

        const copyButton = screen.getByTitle('Copy');
        fireEvent.click(copyButton);

        await waitFor(() => {
            expect(alert).toHaveBeenCalledWith('Povezava dogodka je kopirana v odložišče!');
        });
    });

    it('prevents default action on social media buttons', () => {
        render(<EventDetails event={mockEvent} />);

        // Klikni na vse socialne gumbe
        const facebookButton = screen.getByTitle('Facebook');
        const twitterButton = screen.getByTitle('Twitter');
        const instagramButton = screen.getByTitle('Instagram');

        fireEvent.click(facebookButton);
        fireEvent.click(twitterButton);
        fireEvent.click(instagramButton);

        // Preveri, da se privzeto dejanje ne izvede (npr. ni povezave)
        expect(facebookButton).toHaveAttribute('href', '#');
        expect(twitterButton).toHaveAttribute('href', '#');
        expect(instagramButton).toHaveAttribute('href', '#');
    });

    it('renders social media icons', () => {
        render(<EventDetails event={mockEvent} />);

        const facebookIcon = screen.getByTitle('Facebook');
        const twitterIcon = screen.getByTitle('Twitter');
        const instagramIcon = screen.getByTitle('Instagram');

        // Preveri, da so ikone prikazane
        expect(facebookIcon).toBeInTheDocument();
        expect(twitterIcon).toBeInTheDocument();
        expect(instagramIcon).toBeInTheDocument();
    });

    it('renders event date correctly in Slovenian format', () => {
        render(<EventDetails event={mockEvent} />);
        const dateText = screen.getByText('29.11.2024 ob 11:00');
        expect(dateText).toBeInTheDocument();
    });

    it('updates event details when props change', () => {
        const updatedEvent: Event = {
            ...mockEvent,
            name: 'Updated Test Event',
            description: 'Updated description.',
            location: 'Updated Location',
            organizer: 'Updated Organizer',
        };

        const { rerender } = render(<EventDetails event={mockEvent} />);

        // Initially, check the old event details
        expect(screen.getByText(mockEvent.name)).toBeInTheDocument();

        // Re-render with updated props
        rerender(<EventDetails event={updatedEvent} />);

        // Check if the updated event details are displayed
        expect(screen.getByText(updatedEvent.name)).toBeInTheDocument();
        expect(screen.getByText(updatedEvent.description)).toBeInTheDocument();
        expect(screen.getByText(updatedEvent.location)).toBeInTheDocument();
        expect(screen.getByText(updatedEvent.organizer)).toBeInTheDocument();
    });

});
