import { getAmy } from "@amy-app/amy-app-js-sdk";
import { Role } from "@amy-app/amy-app-js-sdk/dist/src/Amy";
import { Course, CourseAssignment, CourseSection } from "@amy-app/amy-app-js-sdk/dist/src/Course";
import { Button, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
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
        <>
            {role.role}@:Course{role.courseId}
            <Typography variant="h3">{course.name}</Typography>
            {course.sections.map((e) => (
                <SectionTile section={e} key={e.id} />
            ))}
        </>
    );
}

function SectionTile({ section }: { section: CourseSection | CourseAssignment }) {
    const history = useHistory();

    if (section instanceof CourseAssignment) {
        return (
            <Button
                variant="contained"
                onClick={() => {
                    section.start().then((studentAssignmentId) => {
                        history.push(`/StudentAssignment/${studentAssignmentId}`);
                    });
                }}
            >
                {section.id}
            </Button>
        );
    }

    if (section.sections.length === 0) {
        return <>CourseSection: {section.id}</>;
    }

    return (
        <>
            CourseSection: {section.id} <hr />
            {section.sections.map((e) => (
                <SectionTile section={e} key={e.id} />
            ))}
        </>
    );
}
