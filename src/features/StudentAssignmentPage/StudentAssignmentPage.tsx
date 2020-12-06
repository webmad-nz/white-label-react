import { getAmy, StudentAssignment } from "@amy-app/amy-app-js-sdk";
import { Card, CardActionArea, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { InstructionRender } from "../../components/amy-render/DefaultRenderer";
import { useAmyReady } from "../../tools/amyHooks";

const useStyles = makeStyles((theme) => ({
    instruction: {
        borderstyle: "solid",
        borderColor: theme.palette.info.main,
        borderLeftWidth: "8px",
        paddingLeft: "2px",
    },
    correctOption: {
        borderstyle: "solid",
        borderColor: theme.palette.success.main,
        borderLeftWidth: "8px",
        paddingLeft: "2px",
    },
    incorrectOption: {
        borderstyle: "solid",
        borderColor: theme.palette.error.main,
        borderLeftWidth: "8px",
        paddingLeft: "2px",
    },
    unknownOption: {
        borderstyle: "solid",
        borderColor: theme.palette.secondary.main,
        borderLeftWidth: "8px",
        paddingLeft: "2px",
    },
}));

export default function StudentAssignmentPage2() {
    const ready = useAmyReady(getAmy());
    const [exerciseId, setExerciseId] = useState("");
    const { studentAssignmentId } = useParams<{ studentAssignmentId: string }>();
    const [studentAssignment, setStudentAssignment] = useState<StudentAssignment.StudentAssignment>();
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
        if (row instanceof StudentAssignment.InstructionRow) {
            rows.push(
                <Grid item xs={12} key={row.id}>
                    <Card variant="outlined" className={classes.instruction}>
                        <InstructionRender text={row.text} />
                    </Card>
                </Grid>,
            );
        }

        if (row instanceof StudentAssignment.FeedbackRow) {
            rows.push(
                <Grid item xs={12} key={row.id}>
                    <Card variant="outlined" className={classes.instruction}>
                        <InstructionRender text={row.text} />
                    </Card>
                </Grid>,
            );
        }

        if (row instanceof StudentAssignment.OptionRow) {
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
