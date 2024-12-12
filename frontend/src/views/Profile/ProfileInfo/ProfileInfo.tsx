import { useEffect, useState } from 'react';
import { UserWithId, getAllUsers, updateUser, UserRole } from '../../../services/usersApi'; // Adjust the import path
import { Modal, Button, Form } from 'react-bootstrap';
import { signedInUserAtom } from '../../../atoms/signedInUserAtom';
import { useAtom } from 'jotai';
import { userRoleToSlovenian } from '../../../modules/functions/userRoleTranslation';

export default function ProfileInfo() {
    const [user, setUser] = useState<UserWithId | null>(null);
    const [signedInUser, setSignedInUser] = useAtom(signedInUserAtom);
    const [showEditModal, setShowEditModal] = useState(false);
    const [updatedUser, setUpdatedUser] = useState<Omit<UserWithId, 'id'> | null>(null);

    const fetchUser = async () => {
        const usersData = await getAllUsers();
        if (usersData && usersData.length > 0) {
            const currentUser = usersData.find((user) => (user.id===signedInUser?.id))
            if(!currentUser)
                return;
            setUser(currentUser);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleEditModalShow = () => {
        if (user) {
            setUpdatedUser({ username: user.username, password: user.password, fullName: user.fullName, role: user.role });
        }
        setShowEditModal(true);
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
        setUpdatedUser(null);
    };

    const handleUpdateUser = async () => {
        if (user && updatedUser) {
            await updateUser(user.id, updatedUser);
            setUser({ ...user, ...updatedUser } as UserWithId);
            setSignedInUser({ ...user, ...updatedUser } as UserWithId);
            handleEditModalClose();
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Profil</h2>
            {user ? (
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title">{user.fullName}</h5>
                        <h6 className="card-subtitle mb-2 text-muted" style={{marginTop: "1em"}}><strong>Uporabniško ime:</strong> {user.username}</h6>
                        <p className="card-text"><strong>Role:</strong> {userRoleToSlovenian(user.role)}</p>
                        <Button variant="primary" onClick={handleEditModalShow}>
                            Uredi Profil
                        </Button>
                        <Button variant="secondary" onClick={() => {setSignedInUser(undefined);}} style={{marginLeft: "1em"}}>
                            Odjava
                        </Button>
                    </div>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}

            <Modal show={showEditModal} onHide={handleEditModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Uredi Uporabnika</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {updatedUser && (
                        <Form>
                            <Form.Group controlId="formUsername">
                                <Form.Label>Uporabniško Ime</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={updatedUser.username}
                                    onChange={(e) => setUpdatedUser({ ...updatedUser, username: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <Form.Label>Geslo</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={updatedUser.password}
                                    onChange={(e) => setUpdatedUser({ ...updatedUser, password: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formFullName">
                                <Form.Label>Polno Ime</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={updatedUser.fullName}
                                    onChange={(e) => setUpdatedUser({ ...updatedUser, fullName: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formRole">
                                <Form.Label>Vloga</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={updatedUser.role}
                                    onChange={(e) => setUpdatedUser({ ...updatedUser, role: e.target.value as UserRole })}
                                >
                                    <option value={UserRole.MANAGEMENT}>{userRoleToSlovenian(UserRole.MANAGEMENT)}</option>
                                    <option value={UserRole.EMPLOYEE}>{userRoleToSlovenian(UserRole.EMPLOYEE)}</option>
                                    <option value={UserRole.UNASSIGNED}>{userRoleToSlovenian(UserRole.UNASSIGNED)}</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditModalClose}>
                        Prekliči
                    </Button>
                    <Button variant="primary" onClick={handleUpdateUser}>
                        Shrani Spremembe
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
