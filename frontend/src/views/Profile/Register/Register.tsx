import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { addUser, User, UserRole } from "../../../services/usersApi";
import { userRoleToSlovenian } from "../../../modules/functions/userRoleTranslation";

const defaultForm = {
    username: "",
    password: "",
    fullName: "",
    role: UserRole.UNASSIGNED
};

export default function Register() {
    const [formData, setFormData] = useState<Omit<User, 'id'>>(defaultForm);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await addUser(formData);
            alert("Registracija uspešna.\nSedaj se lahko prijavite.");
            setFormData(defaultForm)

        } catch (error) {
            console.error("Error during registration:", error);
            alert("Registracija neuspešna. Poskusite ponovno");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Registracija</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername">
                    <Form.Label>Uporabniško Ime</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword">
                    <Form.Label>Geslo</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formFullName">
                    <Form.Label>Polno Ime</Form.Label>
                    <Form.Control
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formRole">
                    <Form.Label>Vloga</Form.Label>
                    <Form.Control
                        as="select"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value={UserRole.MANAGEMENT}>{userRoleToSlovenian(UserRole.MANAGEMENT)}</option>
                        <option value={UserRole.EMPLOYEE}>{userRoleToSlovenian(UserRole.EMPLOYEE)}</option>
                        <option value={UserRole.UNASSIGNED}>{userRoleToSlovenian(UserRole.UNASSIGNED)}</option>
                    </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Registriraj
                </Button>
            </Form>
        </div>
    );
}
