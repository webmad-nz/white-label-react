import { Container, createMuiTheme, LinearProgress, ThemeProvider } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { green, grey, lightBlue, pink } from "@material-ui/core/colors";
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
import "firebase/database";
import "firebase/firestore";
import React, { useState } from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import "./App.css";
import CoursePage from "./features/course/Course";
import Login from "./features/login/Login";
import StudentAssignmentPage from "./features/StudentAssignmentPage/StudentAssignmentPage";

const theme = createMuiTheme({
    palette: {
        secondary: {
            main: grey[500],
        },
        info: {
            main: lightBlue[500],
        },
        success: {
            main: green[500],
        },
        error: {
            main: pink[500],
        },
    },
});

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
                        <ListItemText primary={"Login"} />
                    </ListItem>
                    <ListItem button component={Link} to="/Course">
                        <ListItemIcon>
                            <MailIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Course"} />
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
}

function App() {
    const loading = false;
    // we show a progress spinner until we know the definite state of the user. which is logged in or not
    if (loading) {
        return <LinearProgress />;
    }

    // if (!user) {
    //     return <Login />;
    // }

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Header />
                <Container maxWidth={false} style={{ padding: "20px" }}>
                    <Switch>
                        <Route path="/StudentAssignment/:studentAssignmentId">
                            <StudentAssignmentPage />
                        </Route>
                        <Route path="/Course">
                            <CoursePage />
                        </Route>
                        <Route path="/">
                            <Login />
                        </Route>
                    </Switch>
                </Container>
            </Router>
        </ThemeProvider>
    );
}

export default App;
