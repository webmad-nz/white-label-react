import { getAmy } from "@amy-app/amy-app-js-sdk";
import { Role } from "@amy-app/amy-app-js-sdk/dist/src/Amy";
import { Course, CourseAssignment, CourseSection } from "@amy-app/amy-app-js-sdk/dist/src/Course";
import { Button, Grid, Paper, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAmyReady } from "../../tools/amyHooks";

export default function CoursePage() {
    const ready = useAmyReady(getAmy());
    const [role, setRole] = useState<Role>();
    const [course, setCourse] = useState<Course>();

    useEffect(() => {
        if (ready) {
            // console.log("user", getAmy().user);
            const r = getAmy().roles[0];
            setRole(r);
        }
    }, [ready]);

    useEffect(() => {
        if (role) {
            // console.log("role", role);
            getAmy().courseObserver(role, (_course) => {
                console.log("course", _course);
                console.log("user", getAmy().user.uid);
                setCourse(_course);
            });
        }
    }, [role]);

    if (!ready || !role || !course) {
        return <>Waiting...</>;
    }

    // course.sections;

    return (
        <Grid container xs={12} spacing={4} style={{ padding: "20px 50px" }}>
            <Grid item xs={12} style={{ opacity: "0.5" }}>
                <Typography variant="h5">
                    {course.title.get()} <hr />
                </Typography>
            </Grid>
            {course.sections.map((e) => (
                <SectionTile section={e} key={e.id} />
            ))}

            <hr />

            <Grid item xs={12}>
                <AmyButton>Amy botton </AmyButton>
            </Grid>

            <hr />
            <Grid item xs={12}>
                <AmyTile>juhu</AmyTile>
            </Grid>
        </Grid>
    );
}

function SectionTile({ section }: { section: CourseSection | CourseAssignment }) {
    const history = useHistory();

    if (section instanceof CourseAssignment) {
        return (
            <AmyButton
                onClick={() => {
                    section.start().then((studentAssignmentId) => {
                        history.push(`/StudentAssignment/${studentAssignmentId}`);
                    });
                }}
            >
                {section.title.get()}
            </AmyButton>
        );
    }

    if (section.sections.length === 0) {
        return (
            <Grid item xs={12}>
                {section.title.get()}
            </Grid>
        );
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h6">
                    {section.title.get()} <hr />
                </Typography>
            </Grid>
            {section.sections.map((e) => (
                <Grid item xs={e instanceof CourseSection ? 12 : "auto"} key={e.id}>
                    <SectionTile section={e} />
                </Grid>
            ))}
        </Grid>
    );
}

interface AmyButtonProps {
    onClick?: () => void;
    children?: React.ReactNode;
}

function AmyButton(props: AmyButtonProps) {
    return (
        <Button
            fullWidth
            variant="contained"
            style={{
                backgroundColor: "white",
                borderTop: "4px solid #3f51b5",
                border: "1px solid #3f51b5",
                borderRadius: "4px",
                margin: "8px 8px 0 0",
                padding: "20px 150px 20px 20px",
                justifyContent: "left",
                textTransform: "none",
            }}
            onClick={props.onClick}
        >
            {props.children}
        </Button>
    );
}

function AmyTile(props: { children?: React.ReactNode }) {
    return (
        <Paper elevation={0}>
            <Grid
                container
                style={{
                    backgroundColor: "white",
                    borderTop: "4px solid #3f51b5",
                    border: "1px solid #3f51b5",
                    borderRadius: "4px",
                    margin: "8px 8px 0 0",
                    padding: "20px 150px 20px 20px",
                }}
            >
                <Grid item xs={12}>
                    {props.children}
                </Grid>
            </Grid>
        </Paper>
    );
}
