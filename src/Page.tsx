import {
    Avatar,
    Button,
    Card,
    CardContent,
    CardHeader,
    Grid,
    IconButton,
    Toolbar,
    Typography,
} from "@material-ui/core";
// import CancelIcon from '@material-ui/icons/Cancel';
// import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/core/styles";
import { AccountCircle } from "@material-ui/icons";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { default as React } from "react";

const useStyles = makeStyles((theme) => ({
    instruction: {
        backgroundColor: "#f1f4fe",
        borderLeft: "8px solid #2d84f7",
        border: "1px solid #2d84f7",
        borderRadius: "4px",
        color: "#222c6b",
        fontWeight: 500,
    },
    correctOption: {
        backgroundColor: "#f5fff5",
        borderLeft: "8px solid #00c200",
        border: "1px solid #00c200",
        borderRadius: "4px",
        color: "#009105",
        fontWeight: 500,
    },
    incorrectOption: {
        backgroundColor: "#fff2f2",
        borderLeft: "8px solid #ff2929",
        border: "1px solid #ff2929",
        borderRadius: "4px",
        color: "#910000",
        fontWeight: 500,
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
                    <Grid item xs={11}>
                        <Card square={true} className={classes.correctOption}>
                            <CardContent>{options}</CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
            {state === "INCORRECT" && (
                <Grid container justify="flex-end">
                    <Grid item xs={11}>
                        <Card square={true} className={classes.incorrectOption}>
                            <CardContent>{options}</CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
            {state === "DEFAULT" && (
                <Grid container spacing={1} justify="flex-end">
                    {options.map((opt) => {
                        return (
                            <Grid item xs={12} direction="column">
                                <Button
                                    fullWidth
                                    variant="contained"
                                    style={{ backgroundColor: "#eef1f5", fontSize: "16px", fontWeight: 600 }}
                                >
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
        <Grid container xs={12} alignItems="center" justify="center">
            <Grid
                container
                xs={7}
                spacing={2}
                alignItems="center"
                justify="center"
                style={{ backgroundColor: "#fafafa", borderRadius: "10px", paddingBottom: "20px" }}
            >
                <AppBar position="static" style={{ borderRadius: "10px 10px 0 0", backgroundColor: "#2d84f7" }}>
                    <Toolbar>
                        <Typography style={{ flexGrow: 1 }}>Amy</Typography>
                        <IconButton>
                            <AccountCircle />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Grid item xs={10}>
                    <CardHeader
                        style={{
                            overflowX: "auto",
                            paddingLeft: 0,
                            paddingBottom: 0,
                        }}
                        avatar={
                            <Avatar style={{ backgroundColor: "#2d84f7" }}>
                                <AssignmentIcon />
                            </Avatar>
                        }
                    />
                </Grid>
                <Grid item xs={10}>
                    <Instruction inst="Add 0 and 5 together." />
                </Grid>
                <Grid item xs={10}>
                    <Option options={["0 - 5"]} state="INCORRECT" />
                </Grid>

                <Grid item xs={10}>
                    <Instruction inst="Close Jurgen, but you subtracted instead of adding, try again." />
                </Grid>
                <Grid item xs={10}>
                    <Option options={["0 + 5"]} state="CORRECT" />
                </Grid>

                <Grid item xs={10}>
                    <Instruction inst="Perfect!" />
                </Grid>
                <Grid item xs={10}>
                    <Option options={["7", "2", "5", "9"]} state="DEFAULT" />
                </Grid>
            </Grid>
        </Grid>
    );
}
