import { Amy, Users } from "@amy-app/js-sdk";
import { AppPage, createAmyTheme } from "@amy-app/react-components";
import { Button, CssBaseline, TextField } from "@material-ui/core";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

Amy.initialize();

const theme = createAmyTheme({
    header: {
        logo: `/logo192.png`,
        background: "00aeef",
        useDarkText: false,
    },
    login: {
        logo: `/logo512.png`,
    },
    backdrop: {
        background: `#ffffff`,
        fadeBackground: true,
        useDarkText: false,
    },
    feedbackRow: {
        neutralBackgroundColor: "#ffffff",
        positiveBackgroundColor: "#22d62b",
        negativeBackgroundColor: "#d34124",
    },
    stickyInstruction: true,
    shape: {
        borderRadius: 5,
    },
    optionRow: {
        unknownBackgroundColor: "#FFFFFF",
        correctBackgroundColor: "#22d62b",
        incorrectBackgroundColor: "#d34124",
    },
    instructionRow: {
        backgroundColor: "#fff",
    },
    stickyOption: false,
    overrides: {
        MuiCard: {
            root: {
                borderRadius: "100px !important",
                margin: "5px 0px !important",
            },
        },
        MuiCardHeader: {
            root: {
                padding: "5px 55px !important",
            },
        },
        MuiCardContent: {
            root: {
                padding: "10px 55px !important",
            },
        },
        MuiCardActions: {
            root: {
                padding: "10px 55px !important",
            },
        },
    },
});

const url = new URL(window.location.href);

const token = url.searchParams.get("token");

Users.signInViaToken({ token }).then(() => {

    console.log("waiting....");

});



ReactDOM.render(
    <React.StrictMode>
        <CssBaseline />
        <AppPage
            theme={theme}
            login={<AuthSpace />}
            onLogout={() => {
                console.log("logout");
            }}
        />
    </React.StrictMode>,
    document.getElementById("root"),
);

function AuthSpace() {
    const [token, setToken] = useState("");

    return (
        <>
            <TextField
                value={token}
                onChange={(e) => {
                    setToken(e.target.value);
                }}
            />
            <Button
                variant="outlined"
                color="primary"
                disabled={!token}
                onClick={() => {
                    // sign in
                    Users.signInViaToken({ token }).then(() => {
                        console.log("Amy is logged in. Wait for the magic to happen");
                    });
                }}
            >
                Login
            </Button>
        </>
    );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
