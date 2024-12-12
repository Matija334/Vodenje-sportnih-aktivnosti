import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";

export interface EventFilterObject {
    text: string;
    date: string;
    location: string;
}

export interface EventFilterProps {
    onFilterUpdate: (filter: EventFilterObject) => void;
}

export const eventFilterEmpty: EventFilterObject = { text: "", date: "", location: "" };

export default function EventFilter({ onFilterUpdate }: EventFilterProps) {
    const [filter, setFilter] = useState<EventFilterObject>(eventFilterEmpty);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newFilter = { ...filter, [name]: value };
        
        console.log({ name, value });
        setFilter(newFilter);
        onFilterUpdate(newFilter);
    };

    // Function to clear the filter and reset to the empty state
    const handleClearFilter = () => {
        setFilter(eventFilterEmpty);
        onFilterUpdate(eventFilterEmpty); // Reset parent component's filter
    };

    return (
        <div className="mb-4 p-3 bg-light rounded shadow-sm">
            <div className="d-flex align-items-center mb-3">
                <h5 className="mb-0">Filter events</h5>
                <Button
                    variant="link"
                    size="sm"
                    style={{color: filter.text || filter.date || filter.location ? "#0d6efd": "grey"}}
                    title="Clear filter"
                    onClick={handleClearFilter}
                    className="ms-2 p-0 text-decoration-none"
                >
                    <FaFilter />
                </Button>
            </div>
            <div className="row g-3">
                <div className="col-md-4">
                    <Form.Label htmlFor="filterText">Keywords</Form.Label>
                    <Form.Control
                        type="text"
                        id="filterText"
                        placeholder="Search by name or description"
                        name="text"
                        value={filter.text}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="col-md-4">
                    <Form.Label htmlFor="filterDate">Date until</Form.Label>
                    <Form.Control
                        type="date"
                        id="filterDate"
                        name="date"
                        value={filter.date}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="col-md-4">
                    <Form.Label htmlFor="filterLocation">Location</Form.Label>
                    <Form.Control
                        type="text"
                        id="filterLocation"
                        placeholder="Search by location"
                        name="location"
                        value={filter.location}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
        </div>
    );
}
