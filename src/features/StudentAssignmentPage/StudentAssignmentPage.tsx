import { getAmy } from "@amy-app/amy-app-js-sdk";
import {
    FeedbackRow,
    InstructionRow,
    OptionRow,
    StudentAssignment,
} from "@amy-app/amy-app-js-sdk/dist/src/StudentAssignment";
import { Card, CardActionArea, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { InstructionRender } from "../../components/amy-render/DefaultRenderer";
import { useAmyReady } from "../../tools/amyHooks";

const useStyles = makeStyles((theme) => ({
    instruction: {
        borderLeft: "8px solid #3f51b5",
        border: "1px solid #3f51b5",
        paddingLeft: "2px",
    },
    correctOption: {
        borderLeft: "8px solid #3fb540",
        border: "1px solid #3fb540",
        paddingLeft: "2px",
    },
    incorrectOption: {
        borderLeft: "8px solid #b53f3f",
        border: "1px solid #b53f3f",
        paddingLeft: "2px",
    },
    unknownOption: {
        borderLeft: "8px solid #b5b5b5",
        border: "1px solid #b5b5b5",
        paddingLeft: "2px",
    },
}));

export default function StudentAssignmentPage2() {
    const ready = useAmyReady(getAmy());
    const [exerciseId, setExerciseId] = useState("");
    const { studentAssignmentId } = useParams<{ studentAssignmentId: string }>();
    const [studentAssignment, setStudentAssignment] = useState<StudentAssignment>();
    const classes = useStyles();

    useEffect(() => {
        if (studentAssignmentId && ready) {
            getAmy().studentAssignmentObserver(studentAssignmentId, (_studentAssignment) => {
                setStudentAssignment(_studentAssignment);
            });
        }
    }, [studentAssignmentId, ready]);

    useEffect(() => {
        if (studentAssignment && !exerciseId && studentAssignment.ready && !studentAssignment.finished) {
            // find first unfinished exercise
            const unfinishedExercise = studentAssignment.exercises.filter((e) => e.finished !== true);
            if (unfinishedExercise.length > 0) {
                setExerciseId(unfinishedExercise[0].id);
            }
        }
    }, [studentAssignment]);

    // We wait until amy is ready and the assignment itself is ready
    if (!ready || !studentAssignment || !studentAssignment.ready || !exerciseId) {
        return <>Waiting...</>;
    }

    // in case the assignment is finished we show finished
    if (studentAssignment.finished) {
        return <>Assignment Finished</>;
    }

    const exercise = studentAssignment.exercises.find((e) => e.id === exerciseId);
    if (!exercise) {
        return <>Done</>;
    }

    const rows = [];

    for (const row of exercise.rows) {
        if (row instanceof InstructionRow) {
            rows.push(
                <Grid item xs={12} key={row.id}>
                    <Card variant="outlined" className={classes.instruction}>
                        <InstructionRender text={row.text} />
                    </Card>
                </Grid>,
            );
        }

        if (row instanceof FeedbackRow) {
            rows.push(
                <Grid item xs={12} key={row.id}>
                    <Card variant="outlined" className={classes.instruction}>
                        <InstructionRender text={row.text} />
                    </Card>
                </Grid>,
            );
        }

        if (row instanceof OptionRow) {
            if (row.correct === "UNKNOWN") {
                for (const option of row.options) {
                    rows.push(
                        <Grid item xs={12} key={option.id}>
                            <Card variant="outlined" className={classes.unknownOption}>
                                <CardActionArea
                                    onClick={() => {
                                        option.select();
                                    }}
                                >
                                    <InstructionRender text={option.text} />
                                </CardActionArea>
                            </Card>
                        </Grid>,
                    );
                }
            } else {
                const o = row.options.find((e) => e.selected);
                rows.push(
                    <Grid item xs={12} key={o.id}>
                        <Card
                            variant="outlined"
                            className={row.correct === "YES" ? classes.correctOption : classes.incorrectOption}
                        >
                            <InstructionRender text={o.text} />
                        </Card>
                    </Grid>,
                );
            }
        }
    }

    return (
        <Grid container spacing={1}>
            {rows}
        </Grid>
    );

    return <>Let's do something</>;
}
