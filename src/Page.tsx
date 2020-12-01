import { Button, Card, CardContent, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { default as React } from "react";

const useStyles = makeStyles((theme) => ({
    instruction: {
        backgroundColor: "white",
        borderLeft: "8px solid #2d84f7",
        border: "1px solid #2d84f7",
        borderRadius: "4px",
    },
    correctOption: {
        backgroundColor: "white",
        borderLeft: "8px solid #00c200",
        border: "1px solid #00c200",
        borderRadius: "4px",
    },
    incorrectOption: {
        backgroundColor: "white",
        borderLeft: "8px solid #ff2929",
        border: "1px solid #ff2929",
        borderRadius: "4px",
    },
}));

export function Instruction({ inst }: { inst: string }) {
    const classes = useStyles();
    return (
        <Card square={true} className={classes.instruction}>
            <CardContent>{inst}</CardContent>
        </Card>
    );
}

export function Option({ options, state }: { options: string[]; state: string }) {
    const classes = useStyles();
    return (
        <>
            {state === "CORRECT" && (
                <Grid container justify="flex-end">
                    <Grid item xs={11} className={classes.correctOption}>
                        <Button fullWidth={true}>{options}</Button>
                    </Grid>
                </Grid>
            )}
            {state === "INCORRECT" && (
                <Grid container justify="flex-end">
                    <Grid item xs={11} className={classes.incorrectOption}>
                        <Button fullWidth={true}>{options}</Button>
                    </Grid>
                </Grid>
            )}
            {state === "DEFAULT" && (
                <Grid container spacing={1} justify="flex-end">
                    {options.map((opt) => {
                        return (
                            <Grid item xs={12}>
                                <Button fullWidth variant="contained">
                                    {opt}
                                </Button>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </>
    );
}

export default function Page() {
    return (
        <Grid container xs={12} spacing={2} alignItems="center" justify="center">
            <Grid item xs={8}>
                <Instruction inst="Add 0 and 5 together." />
            </Grid>
            <Grid item xs={8}>
                <Option options={["0 - 5"]} state="INCORRECT" />
            </Grid>

            <Grid item xs={8}>
                <Instruction inst="Close Jurgen, but you subtracted instead of adding, try again." />
            </Grid>
            <Grid item xs={8}>
                <Option options={["0 + 5"]} state="CORRECT" />
            </Grid>

            <Grid item xs={8}>
                <Instruction inst="Perfect!" />
            </Grid>
            <Grid item xs={8}>
                <Option options={["7", "2", "5", "9"]} state="DEFAULT" />
            </Grid>
        </Grid>
    );
}
