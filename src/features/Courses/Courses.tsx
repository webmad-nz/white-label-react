import { Courses } from "@amy-app/amy-app-js-sdk";
import { CardActionArea, CardActions, Grid, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useCourseObserver } from "../../tools/amyHooks";

export default function CoursesComponent() {
    const courses = useCourseObserver();
    const [inviteCode, setInviteCode] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const gridItems: JSX.Element[] = [];

    for (const course of courses) {
        gridItems.push(
            <Grid item xs={6} key={course.courseId}>
                <Card>
                    <CardActionArea
                        onClick={() => {
                            history.push(`/Courses/${course.courseId}`);
                        }}
                    >
                        <CardHeader title={course.title.get("en")} subheader={course.subtitle.get("en") || " space"} />
                    </CardActionArea>
                </Card>
            </Grid>,
        );
    }

    // Add to course
    gridItems.push(
        <Grid item xs={6} key={"add"}>
            <Card>
                <CardHeader
                    title={
                        <>
                            <TextField
                                label="Invite Code"
                                value={inviteCode}
                                onChange={(e) => {
                                    setInviteCode(e.target.value);
                                }}
                            />
                        </>
                    }
                />
                <CardActions>
                    <Button
                        size="small"
                        color="primary"
                        disabled={loading || !inviteCode.trim()}
                        onClick={() => {
                            setLoading(true);

                            Courses.join({ inviteCode })
                                .then(({ resourceId }) => {
                                    console.log("resourceId", resourceId);
                                    if (resourceId) {
                                        history.push(`/Courses/${resourceId}`);
                                    }
                                })

                                .finally(() => {
                                    setTimeout(() => {
                                        setLoading(false);
                                    }, 300);
                                });
                        }}
                    >
                        {"Activate your invite code"}
                    </Button>
                </CardActions>
            </Card>
        </Grid>,
    );

    return (
        <Grid container spacing={1}>
            {gridItems}
        </Grid>
    );
}
