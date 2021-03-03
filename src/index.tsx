import { Amy } from "@amy-app/amy-app-js-sdk";
import { CssBaseline } from "@material-ui/core";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

// let conf = Amy.amyConfigs;
// if (process.env.REACT_APP_USE_EMULATOR === "true" || true) {
//     conf = {
//         apiKey: "AIzaSyD4Y4Rb1detiPVFjoHtbhaSxWOo7KiEKjQ",
//         // @ts-ignore
//         authDomain: "dev1-amy-app.firebaseapp.com",
//         databaseURL: "https://dev1-amy-app.firebaseio.com",
//         projectId: "dev1-amy-app",
//         storageBucket: "dev1-amy-app.appspot.com",
//         messagingSenderId: "712940000014",
//         appId: "1:712940000014:web:cc63c7d4c00e4ab9",
//     };
// }

// let firebaseApp: firebase.app.App = firebase.initializeApp(conf, "amy.app");

// if (process.env.REACT_APP_USE_EMULATOR === "true") {
//     firebaseApp.auth().useEmulator("http://localhost:9099/");
//     firebaseApp.database().useEmulator("localhost", 9000);
//     firebaseApp.firestore().useEmulator("localhost", 8080);
//     firebaseApp.functions().useEmulator("localhost", 5001);
// }

Amy.initialize();

//@ts-ignore
// window.firebaseApp = firebaseApp;

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
