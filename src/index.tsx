import { amyConfigs, initializeAmy } from "@amy-app/amy-app-js-sdk";
import { CssBaseline } from "@material-ui/core";
import firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

let firebaseApp: firebase.app.App = firebase.initializeApp(amyConfigs, "amy.app");
initializeAmy({ firebaseApp });

//@ts-ignore
window.firebaseApp = firebaseApp;

ReactDOM.render(
    <React.StrictMode>
        <CssBaseline />
        <App />
    </React.StrictMode>,
    document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
