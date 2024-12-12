import { useAtom } from "jotai";
import { signedInUserAtom } from "../../atoms/signedInUserAtom";
import Register from "./Register/Register";
import { useState } from "react";
import Login from "./Login/Login";
import { Button } from "react-bootstrap";
import ProfileInfo from "./ProfileInfo/ProfileInfo";

export default function Profile() {
    const [signedInUser] = useAtom(signedInUserAtom);
    const [wantToRegister, setWantToRegister] = useState<boolean>(false)

    if(!signedInUser)
        return (
            <>
                {!wantToRegister && <Login />}
                {wantToRegister && <Register />}
                
                <Button variant="link" type="submit" className="mt-3" onClick={() => {setWantToRegister(!wantToRegister)}}>
                    {wantToRegister ? "Prijava" : "Registracija"}
                </Button>
            </>
        );

    return (
        <>
            <ProfileInfo />
        </>
    );
};
