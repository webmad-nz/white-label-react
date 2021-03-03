import { Container, createMuiTheme, ThemeProvider } from "@material-ui/core";
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
import StudentAssignmentPage from "./features/Assignment/Assignment";
import CourseComponent from "./features/Course/Course";
import Courses from "./features/Courses/Courses";
// import CoursePage from "./features/course/Course";
import Login from "./features/login/Login";

// Theme colors can be found here: https://material-ui.com/customization/color/#color
// The theme elements can found be here: https://material-ui.com/customization/palette/
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
                    <ListItem button component={Link} to="/Courses">
                        <ListItemIcon>
                            <MailIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Courses"} />
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Header />
                <Container maxWidth={false} style={{ padding: "20px" }}>
                    <Switch>
                        <Route path="/Assignments/:studentAssignmentId">
                            <StudentAssignmentPage />
                        </Route>
                        {/* <Route path="/StudentAssignment/:studentAssignmentId">
                            <StudentAssignmentPage />
                        </Route>
                        <Route path="/Course">
                            <CoursePage />
                        </Route> */}
                        <Route path="/Courses/*">
                            <CourseComponent />
                        </Route>
                        <Route path="/Courses">
                            <Courses />
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
