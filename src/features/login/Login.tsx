import { getAmy } from "@amy-app/amy-app-js-sdk";
import { Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useReady } from "../../tools/amyHooks";

export default function Login() {
    const ready = useReady(getAmy());
    const history = useHistory();
    const [token, setToken] = useState("");
    const [archetype, startArchetype] = useState("frac570001");

    if (!ready) {
        return (
            <>
                <TextField
                    label="Token"
                    onChange={(e) => {
                        setToken(e.target.value);
                    }}
                />
                <Button
                    variant="contained"
                    disabled={!token}
                    onClick={() => {
                        getAmy()
                            .signInViaToken(token)
                            .then(() => {
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
                    getAmy()
                        .startAssignment([archetype])
                        .then((_studentAssignmentId) => {
                            history.push(`/StudentAssignment/${_studentAssignmentId}`);
                        });
                }}
            >
                Start
            </Button>
        </>
    );
}
