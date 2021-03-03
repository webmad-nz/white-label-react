import { Models, StudentAssignment } from "@amy-app/amy-app-js-sdk";
import { Card, CardActionArea, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { InstructionRender } from "../../components/amy-render/DefaultRenderer";
import { useStudentAssignment } from "../../tools/amyHooks";

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
    const [exerciseId, setExerciseId] = useState("");
    const { studentAssignmentId } = useParams<{ studentAssignmentId: string }>();
    const { studentAssignment, exercises, rows } = useStudentAssignment(studentAssignmentId);
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
        if (studentAssignment && !exerciseId && !studentAssignment.finished) {
            // find first unfinished exercise
            const unfinishedExercise = exercises.find((e) => !e.finished);
            if (unfinishedExercise) {
                setExerciseId(unfinishedExercise.exerciseId);
            }
        }
    }, [studentAssignment]);

    // We wait until amy is ready and the assignment itself is ready
    if (!studentAssignment || !exerciseId) {
        return <>Waiting...</>;
    }

    // in case the assignment is finished we show finished
    if (studentAssignment.finished) {
        return <>Assignment Finished</>;
    }

    const exercise = studentAssignment.exercises.find((e) => e.exerciseId === exerciseId);
    if (!exercise) {
        return <>Done</>;
    }

    // find the most recent correct bubble so we can stick it to the top of the screen
    const latestCorrect = rows
        .filter((e) => e.exerciseId === exerciseId)
        .reverse()
        .find((row) => row instanceof Models.OptionRow && row.correct === "YES");

    const rowsItems: JSX.Element[] = [];
    for (const row of rows.filter((e) => e.exerciseId === exerciseId)) {
        if (row instanceof Models.InstructionRow) {
            rowsItems.push(
                <Grid
                    item
                    xs={12}
                    key={row.rowId}
                    ref={questionBubbleRef}
                    className={questionBubbleHeight < 200 ? classes.stickyBubble : ""}
                >
                    <Card variant="outlined" className={`${classes.bubble} ${classes.instruction}`}>
                        <InstructionRender text={row.text} />
                    </Card>
                </Grid>,
            );
        }

        if (row instanceof Models.FeedbackRow) {
            rowsItems.push(
                <Grid item xs={12} key={row.rowId}>
                    <Card variant="outlined" className={`${classes.bubble} ${classes.instruction}`}>
                        <InstructionRender text={row.text} />
                    </Card>
                </Grid>,
            );
        }

        if (row instanceof Models.OptionRow) {
            if (row.correct === "UNKNOWN") {
                for (const option of row.options) {
                    rowsItems.push(
                        <Grid item xs={12} key={`${row.rowId}_${option.optionId}`}>
                            <Card variant="outlined" className={`${classes.bubble} ${classes.unknownOption}`}>
                                <CardActionArea
                                    onClick={() => {
                                        StudentAssignment.selectOption({ optionRow: row, option });
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
                    rowsItems.push(
                        <Grid
                            item
                            xs={12}
                            key={`selected_${row.rowId}_${o.optionId}`}
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
        rowsItems.push(
            <Grid item xs={12} key={`finished_${exercise.exerciseId}`}>
                <Card variant="outlined" className={`${classes.bubble} ${classes.unknownOption}`}>
                    <CardActionArea
                        onClick={() => {
                            // select next exercise
                            const unfinishedExercise = studentAssignment.exercises.find((e) => e.finished !== true);
                            if (unfinishedExercise) {
                                setExerciseId(unfinishedExercise.exerciseId);
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
            {rowsItems}
        </Grid>
    );
}
