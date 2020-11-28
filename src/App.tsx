import { Container, LinearProgress } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import "firebase/auth";
import "firebase/firestore";
import React, { useState } from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import "./App.css";

// TODO Init firebase/amy

function Header() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setOpen(!open)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">White Label for Amy.app</Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                container={window.document.body}
                open={open}
                onClick={() => {
                    setOpen(false);
                }}
            >
                <List>
                    <ListItem button component={Link} to="/">
                        <ListItemIcon>
                            <MailIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Home"} />
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
}

function App() {
    // const [user, loading] = useAuthState(firebase.auth());
    const loading = false;
    // we show a progress spinner until we know the definite state of the user. which is logged in or not
    if (loading) {
        return <LinearProgress />;
    }

    // if (!user) {
    //     return <Login />;
    // }

    return (
        <>
            <Router>
                <Header />
                <Container maxWidth={false} style={{ padding: "20px" }}>
                    <Switch>
                        <Route path="/">Home</Route>
                    </Switch>
                </Container>
            </Router>
        </>
    );
}

export default App;
