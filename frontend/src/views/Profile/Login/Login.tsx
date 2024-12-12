import React, { useState } from "react";
import { useAtom } from "jotai";
import { Button, Form } from "react-bootstrap";
import { loginUser } from "../../../services/usersApi";
import { signedInUserAtom } from "../../../atoms/signedInUserAtom";

export default function Login() {
    const [, setSignedInUser] = useAtom(signedInUserAtom);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user = await loginUser(username, password);
        if(!user) {
            setError("Napačno uporabniško ime ali geslo.");
            return;
        }

        setSignedInUser(user);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Prijava</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername">
                    <Form.Label>Uporabniško Ime</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword">
                    <Form.Label>Geslo</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                {error && <div className="text-danger mt-2">{error}</div>} {/* Display error message */}

                <Button variant="primary" type="submit" className="mt-3">
                    Prijavi se
                </Button>
            </Form>
        </div>
    );
}
