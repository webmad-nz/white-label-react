import { Course, Models } from "@amy-app/amy-app-js-sdk";
import { Avatar, CardActionArea, Grid, LinearProgress } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import AssignmentIcon from "@material-ui/icons/CreateNewFolder";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { InstructionRender } from "../../components/amy-render/DefaultRenderer";
import { useCourse, useCourseSection } from "../../tools/amyHooks";

export default function CourseComponent() {
    const location = useLocation();
    const splitPath = location.pathname
        .replace("/Courses", "")
        .split("/")
        .filter((e) => !!e);

    const courseId = splitPath[0];
    let parentCourseSectionId = splitPath.reverse()[0];
    const { course } = useCourse(courseId);
    const { assignments, sections } = useCourseSection(courseId, parentCourseSectionId);
    const history = useHistory();

    const gridItems: JSX.Element[] = [];

    for (const section of sections) {
        gridItems.push(
            <Grid item xs={6} key={section.courseSectionId}>
                <Card>
                    <CardActionArea
                        onClick={() => {
                            history.push(`${window.location.pathname}/${section.courseSectionId}`);
                        }}
                    >
                        <CardHeader
                            title={section.title.get("en")}
                            subheader={section.subtitle.get("en") || " space"}
                        />
                    </CardActionArea>
                </Card>
            </Grid>,
        );
    }

    for (const assignment of assignments) {
        gridItems.push(
            <Grid item xs={6} key={assignment.courseAssignmentId}>
                <Card>
                    <AssignmentItem assignment={assignment} course={course} />
                </Card>
            </Grid>,
        );
    }

    return (
        <Grid container spacing={1}>
            {gridItems}
        </Grid>
    );
}

function AssignmentItem({ assignment, course }: { assignment: Models.CourseAssignment; course: Models.Course }) {
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    return (
        <Card>
            {!loading && <LinearProgress color="primary" variant="determinate" value={5} />}
            {loading && <LinearProgress color="primary" variant="indeterminate" />}

            <CardActionArea
                onClick={() => {
                    setLoading(true);
                    Course.getStudentAssignmentId({
                        course,
                        courseAssignmentId: assignment.courseAssignmentId,
                    })
                        .then(({ studentAssignmentId }) => {
                            history.push(`/Assignments/${studentAssignmentId}`);
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                }}
            >
                <CardHeader
                    avatar={
                        <Avatar>
                            <AssignmentIcon />
                        </Avatar>
                    }
                    title={<InstructionRender text={assignment.title.get("en")} />}
                    subheader={assignment.subtitle.get("en") || " space"}
                />
            </CardActionArea>
        </Card>
    );
}
