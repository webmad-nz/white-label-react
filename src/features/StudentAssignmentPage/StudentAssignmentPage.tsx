import { getAmy, StudentAssignment } from "@amy-app/amy-app-js-sdk";
import { Card, CardActionArea, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { InstructionRender } from "../../components/amy-render/DefaultRenderer";
import { useAmyReady } from "../../tools/amyHooks";

const useStyles = makeStyles((theme) => ({
    bubble: {
        borderstyle: "solid",
        borderLeftWidth: "8px",
        paddingLeft: "2px",
    },
    stickyBubble: {
        position: "sticky",
        top: 0,
        zIndex: 100,
    },
    instruction: {
        borderColor: theme.palette.info.main,
    },
    correctOption: {
        borderColor: theme.palette.success.main,
    },
    incorrectOption: {
        borderColor: theme.palette.error.main,
    },
    unknownOption: {
        borderColor: theme.palette.secondary.main,
    },
}));

export default function StudentAssignmentPage2() {
    const ready = useAmyReady(getAmy());
    const [exerciseId, setExerciseId] = useState("");
    const { studentAssignmentId } = useParams<{ studentAssignmentId: string }>();
    const [studentAssignment, setStudentAssignment] = useState<StudentAssignment.StudentAssignment>();
    const [questionBubbleHeight, setQuestionBubbleheight] = useState(100);

    const classes = useStyles();

    // Save the question height, lets us calculate how to make it stick to top of screen
    const questionBubbleRef = useRef(null);
    useEffect(() => {
        if (questionBubbleRef.current) {
            setQuestionBubbleheight(questionBubbleRef.current.clientHeight);
        }
    });

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
            const unfinishedExercise = studentAssignment.exercises.find((e) => e.finished !== true);
            if (unfinishedExercise) {
                setExerciseId(unfinishedExercise.id);
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

    // find the most recent correct bubble so we can stick it to the top of the screen
    const latestCorrect = [...exercise.rows]
        .reverse()
        .find((row) => row instanceof StudentAssignment.OptionRow && row.correct === "YES");

    const rows = [];
    for (const row of exercise.rows) {
        if (row instanceof StudentAssignment.InstructionRow) {
            rows.push(
                <Grid
                    item
                    xs={12}
                    key={row.id}
                    ref={questionBubbleRef}
                    className={questionBubbleHeight < 200 ? classes.stickyBubble : ""}
                >
                    <Card variant="outlined" className={`${classes.bubble} ${classes.instruction}`}>
                        <InstructionRender text={row.text} />
                    </Card>
                </Grid>,
            );
        }

        if (row instanceof StudentAssignment.FeedbackRow) {
            rows.push(
                <Grid item xs={12} key={row.id}>
                    <Card variant="outlined" className={`${classes.bubble} ${classes.instruction}`}>
                        <InstructionRender text={row.text} />
                    </Card>
                </Grid>,
            );
        }

        if (row instanceof StudentAssignment.OptionRow) {
            if (row.correct === "UNKNOWN") {
                for (const option of row.options) {
                    rows.push(
                        <Grid item xs={12} key={`${row.id}_${option.id}`}>
                            <Card variant="outlined" className={`${classes.bubble} ${classes.unknownOption}`}>
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
                if (o) {
                    rows.push(
                        <Grid
                            item
                            xs={12}
                            key={`selected_${row.id}_${o.id}`}
                            className={row === latestCorrect ? classes.stickyBubble : ""}
                            style={
                                row === latestCorrect
                                    ? {
                                          top: questionBubbleHeight < 200 ? `${questionBubbleHeight}px` : 0,
                                      }
                                    : {}
                            }
                        >
                            <Card
                                variant="outlined"
                                className={`${classes.bubble} ${
                                    row.correct === "YES" ? classes.correctOption : classes.incorrectOption
                                }`}
                            >
                                <InstructionRender text={o.text} />
                            </Card>
                        </Grid>,
                    );
                }
            }
        }
    }

    // Exercise has finished
    if (exercise.finished) {
        rows.push(
            <Grid item xs={12} key={`finished_${exercise.id}`}>
                <Card variant="outlined" className={`${classes.bubble} ${classes.unknownOption}`}>
                    <CardActionArea
                        onClick={() => {
                            // select next exercise
                            const unfinishedExercise = studentAssignment.exercises.find((e) => e.finished !== true);
                            if (unfinishedExercise) {
                                setExerciseId(unfinishedExercise.id);
                            }
                        }}
                    >
                        <InstructionRender text={"Next"} />
                    </CardActionArea>
                </Card>
            </Grid>,
        );
    }

    return (
        <Grid container spacing={1}>
            {rows}
        </Grid>
    );
}
