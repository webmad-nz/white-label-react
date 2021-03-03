import { Amy } from "@amy-app/amy-app-js-sdk";
import { Button, Card, CardActions, CardContent, TextField, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAmyObserver } from "../../tools/amyHooks";

export default function Login() {
    const { user } = useAmyObserver();
    const history = useHistory();
    const [token, setToken] = useState("");
    const [archetype, startArchetype] = useState("frac570001");

    if (!user) {
        if (process.env.REACT_APP_USE_EMULATOR == "true") {
            return <EmulatorLogin />;
        }

        return (
            <>
                <TextField
                    label="Token"
                    value={token}
                    onChange={(e) => {
                        setToken(e.target.value);
                    }}
                />
                <Button
                    variant="contained"
                    disabled={!token}
                    onClick={() => {
                        Amy.signInViaToken({ token }).then(() => {
                            console.log("waiting....");
                        });
                    }}
                >
                    Login
                </Button>
            </>
        );
    }

    return (
        <>
            Congratulation! You are logged in!. <br />
            Your <code>UserId</code> is <code>{user.uid}</code>
        </>
    );

    return (
        <>
            <TextField
                label="Archetype"
                onChange={(e) => {
                    startArchetype(e.target.value);
                }}
                value={archetype}
            />
            <Button
                variant="contained"
                disabled={!archetype}
                onClick={() => {
                    // Amy.getAmy()
                    //     .startAssignment([archetype])
                    //     .then((_studentAssignmentId) => {
                    //         history.push(`/StudentAssignment/${_studentAssignmentId}`);
                    //     });
                }}
            >
                Start
            </Button>
        </>
    );
}

function EmulatorLogin() {
    const [email, setEmail] = useState("emulator@amy.app");
    const [password, setPassword] = useState("secretPassword");

    return (
        <Card>
            <CardContent>
                <Typography component="h1">Sign in in EMULATOR</Typography>
                <TextField label={"email"} value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <TextField label={"Password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                        Amy.getFirebase()
                            .auth()
                            .signInWithEmailAndPassword(email, password)
                            .then((e) => {
                                console.log("all good");
                            })
                            .catch((e) => {
                                // create user
                                console.log("User does not exists. Time to create one");
                                return Amy.getFirebase().auth().createUserWithEmailAndPassword(email, password);
                            });
                    }}
                >
                    Login
                </Button>
            </CardActions>
        </Card>
    );
}
