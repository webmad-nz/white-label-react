import { Button } from "@material-ui/core";
import firebase from "firebase";
import React from "react";

const login = () => {
    return firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
};

export default function Login() {
    return (
        <Button variant="contained" onClick={login}>
            Google Login
        </Button>
    );
}
