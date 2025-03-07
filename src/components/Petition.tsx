import Navbar from "./Navbar";
import PetitionsObject from "./PetitionsObject";
import CSS from "csstype";
import {
    Alert,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
    AlertTitle,
    Paper,
    Button,
    TableContainer,
    MenuItem,
    TableHead,
    Typography,
    TableCell,
    TableRow,
    Table,
    TableBody,
    TextField,
    Select,
} from "@mui/material";
import React from "react";
import axios from "axios";
import BASE_URL from "../config";
import { useNavigate, useParams } from "react-router-dom";
import defaultImage from "../resources/default_profile_image.png";
import errorImage from "../resources/no-photo.png";
import SupportTierObject from "./SupportTierObject";
import SupporterObject from "./SupporterObject";
import { useAuthUserStore } from "../store";

const Petition = () => {
    const authUser = useAuthUserStore((state) => state.authUser);
    const [petition, setPetition] = React.useState<SinglePetition>(
        {} as SinglePetition,
    );
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const { id } = useParams();
    const [petitionImageUrl, setPetitionImageUrl] = React.useState("");
    const [ownerImageUrl, setOwnerImageUrl] = React.useState("");
    const [supportTiers, setSupportTiers] = React.useState<Array<SupportTier>>(
        [],
    );
    const [supporters, setSupporters] = React.useState<Array<Supporter>>([]);
    const [petitions, setPetitions] = React.useState<Array<Petition>>([]);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openSupportDialog, setOpenSupportDialog] = React.useState(false);
    const [supportPetitionTierId, setSupportPetitionTierId] = React.useState(NaN);
    const [supportPetitionMessage, setSupportPetitionMessage] =
        React.useState("");
    const navigate = useNavigate();

    React.useEffect(() => {
        axios
            .get(BASE_URL + "/petitions/" + id)
            .then((response) => {
                setPetition(response.data);
                setSupportTiers(response.data.supportTiers);
                setErrorFlag(false);
                setErrorMessage("");
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    }, [id]);

    React.useEffect(() => {
        if (petition) {
            axios
                .get(BASE_URL + "/petitions/" + petition.petitionId + "/image", {
                    responseType: "blob",
                })
                .then((response) => {
                    const url = URL.createObjectURL(response.data);
                    setPetitionImageUrl(url);
                })
                .catch((error) => {
                    console.error(error.toString());
                });
        }
    }, [petition]);

    React.useEffect(() => {
        if (petition) {
            axios
                .get(BASE_URL + "/users/" + petition.ownerId + "/image", {
                    responseType: "blob",
                })
                .then((response) => {
                    const url = URL.createObjectURL(response.data);
                    setOwnerImageUrl(url);
                })
                .catch((error) => {
                    console.log(error.toString());
                    setOwnerImageUrl(defaultImage);
                });
        }
    }, [petition]);

    React.useEffect(() => {
        if (petition) {
            axios
                .get(BASE_URL + "/petitions/" + id + "/supporters")
                .then((response) => {
                    setSupporters(response.data);
                })
                .catch((error) => {
                    console.log("GET Petition supporters:", error.toString());
                });
        }
    }, [petition]);

    React.useEffect(() => {
        axios.get(BASE_URL + "/petitions").then(
            (response) => {
                let validPetitions = response.data.petitions;
                setPetitions(
                    validPetitions.filter(
                        (new_petition: Petition) =>
                            (new_petition.ownerId === petition.ownerId ||
                                new_petition.categoryId === petition.categoryId) &&
                            new_petition.petitionId !== petition.petitionId,
                    ),
                );
            },
            (error) => {
                setErrorMessage(error.toString());
            },
        );
    }, [petition]);

    function formatDate(date: Date): string {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${day} ${month}, ${year} at ${formattedHours}:${formattedMinutes}${ampm}`;
    }

    const paperStyle: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "grid",
        width: "fill",
    };

    const support_tiers = () =>
        supportTiers.map((supportTier: SupportTier) => (
            <SupportTierObject
                key={supportTier.supportTierId}
                supportTier={supportTier}
            />
        ));

    const supporter_rows = () =>
        supporters.map((supporter: Supporter) => (
            <SupporterObject
                key={supporter.supporterId}
                supporter={supporter}
                supportTiers={supportTiers}
            />
        ));

    const petition_rows = () =>
        petitions.map((petition: Petition) => (
            <PetitionsObject key={petition.petitionId} petition={petition} />
        ));

    const handleDeleteDialogOpen = (petition: Petition) => {
        setOpenDeleteDialog(true);
    };

    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
    };

    const deletePetition = () => {
        axios
            .delete(BASE_URL + "/petitions/" + petition.petitionId, {
                headers: {
                    "X-Authorization": authUser?.token,
                },
            })
            .then((response) => {
                navigate("/");
            })
            .catch((error) => {
                console.error(error.toString());
            });
    };

    const handleSupportPetition = () => {
        axios
            .post(
                BASE_URL + "/petitions/" + petition.petitionId + "/supporters",
                {
                    supportTierId: supportPetitionTierId,
                    message: supportPetitionMessage,
                },
                {
                    headers: {
                        "X-Authorization": authUser?.token,
                    },
                },
            )
            .then((response) => {
                setOpenSupportDialog(false);
            })
            .catch((error) => {
                console.error(error.toString());
            });
    };

    const handleSupportPetitionTierChange = (event: any) => {
        setSupportPetitionTierId(event.target.value as number);
    };

    return (
        <div>
            <div>
                <Navbar />
            </div>
            {errorFlag && (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>
            )}
            <Paper style={paperStyle} elevation={3}>
                <div style={{ display: "flex", padding: "50px 50px 0 50px" }}>
                    <div>
                        <img
                            src={petitionImageUrl}
                            alt="Petition"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = errorImage;
                            }}
                            style={{
                                objectFit: "cover",
                                width: "250px",
                                height: "250px",
                                borderRadius: "20px",
                                marginBottom: "20px",
                            }}
                        />
                        <Typography variant="body1">Owner</Typography>
                        <Typography variant="h5">
                            {petition.ownerFirstName} {petition.ownerLastName}
                        </Typography>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                paddingTop: "10px",
                            }}
                        >
                            <img
                                src={ownerImageUrl}
                                alt="Owner Image"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = defaultImage;
                                }}
                                style={{
                                    objectFit: "cover",
                                    width: "150px",
                                    height: "150px",
                                    borderRadius: "50%",
                                }}
                            />
                        </div>
                        {authUser?.userId === petition.ownerId &&
                            petition.numberOfSupporters === 0 && (
                                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        style={{ marginTop: "20px", width: "50%" }}
                                        onClick={() => setOpenDeleteDialog(true)}
                                    >
                                        Delete Petition
                                    </Button>
                                </div>
                            )}
                        {authUser?.userId !== petition.ownerId && (
                            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    style={{ marginTop: "20px", width: "50%" }}
                                    onClick={() => setOpenSupportDialog(true)}
                                >
                                    Support Petition
                                </Button>
                            </div>
                        )}
                        {authUser?.userId === petition.ownerId &&
                            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                <Button
                                    variant="contained"
                                    style={{ marginTop: "10px", width: "50%" }}
                                    onClick={() => navigate("/editPetitions/" + petition.petitionId)}
                                >
                                    Edit Petition
                                </Button>
                            </div>
                        }
                    </div>
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            marginLeft: "50px",
                            textAlign: "left",
                        }}
                    >
                        <Typography variant="h2">{petition.title}</Typography>
                        <br />
                        <Typography variant="h6">{petition.description}</Typography>
                        <br />
                        <Typography variant="body1">
                            Creation date: {formatDate(new Date(petition.creationDate))}
                        </Typography>
                        <Typography variant="body1">
                            This petition has {petition.numberOfSupporters}{" "}
                            {petition.numberOfSupporters === 1 ? "supporter" : "supporters"}
                        </Typography>
                        <Typography variant="body1">
                            This petition has raised $
                            {petition.moneyRaised ? petition.moneyRaised : 0}
                        </Typography>
                        <div
                            style={{
                                width: "100%",
                                textAlign: "center",
                                margin: "30px 0 10px 0",
                            }}
                        >
                            <Typography variant="h4">Support Tiers</Typography>
                        </div>
                        <div>{support_tiers()}</div>
                        <div
                            style={{
                                width: "100%",
                                textAlign: "center",
                                margin: "30px 0 10px 0",
                            }}
                        >
                            <Typography variant="h4">Supporters</Typography>
                        </div>
                        <div>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <b>Name</b>
                                            </TableCell>
                                            <TableCell>
                                                <b>Support Tier</b>
                                            </TableCell>
                                            <TableCell>
                                                <b>Date</b>
                                            </TableCell>
                                            <TableCell>
                                                <b>Message</b>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>{supporter_rows()}</TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </div>
                <Typography variant="h4" style={{ marginTop: "30px" }}>
                    Similar Petitions
                </Typography>
                <div
                    style={{
                        display: "flex",
                        margin: "0 50px 50px 50px",
                        justifyContent: "center",
                    }}
                >
                    <div style={{ display: "inline-block", minWidth: "320px" }}>
                        {petitions.length !== 0 && petition_rows()}
                        {petitions.length === 0 && (
                            <Typography
                                variant="subtitle1"
                                style={{ color: "grey", marginTop: "20px" }}
                            >
                                There are no similar petitions.
                            </Typography>
                        )}
                    </div>
                </div>
            </Paper>

            <Dialog
                open={openDeleteDialog}
                onClose={handleDeleteDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{ textAlign: "center" }}
            >
                <DialogTitle id="alert-dialog-title">{"Delete Petition"}</DialogTitle>
                <DialogContent
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        paddingBottom: "0",
                    }}
                >
                    <DialogContentText
                        id="alert-dialog-description"
                        style={{ paddingTop: "10px" }}
                    >
                        Are you sure you want to delete this petition?
                    </DialogContentText>
                    <DialogActions
                        style={{
                            justifyContent: "center",
                            height: "100%",
                            paddingTop: "40px",
                        }}
                    >
                        <Button
                            style={{ width: "100%", height: "50px" }}
                            variant="outlined"
                            onClick={handleDeleteDialogClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            style={{ width: "100%", height: "50px" }}
                            variant="contained"
                            color="error"
                            disableElevation
                            onClick={() => deletePetition()}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </DialogContent>
                <DialogContent></DialogContent>
            </Dialog>
            <Dialog
                open={openSupportDialog}
                onClose={() => setOpenSupportDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{ textAlign: "center", minWidth: "400px" }}
            >
                <DialogTitle id="alert-dialog-title">Support Petition</DialogTitle>
                {!authUser && (
                    <DialogContent
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            paddingBottom: "0",
                        }}
                    >
                        <DialogContentText style={{ paddingTop: "10px", color: "#e15141" }}>
                            You cannot support petitions as a guest. Login or register to
                            support this petition.
                        </DialogContentText>
                    </DialogContent>
                )}

                {authUser && (
                    <DialogContent
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            paddingBottom: "0",
                            minWidth: "400px",
                        }}
                    >
                        <DialogContentText
                            id="alert-dialog-description"
                            style={{ paddingTop: "10px" }}
                        >
                            Share your support!
                            <div
                                style={{ display: "block", width: "100%", marginTop: "30px" }}
                            >
                                <TextField
                                    label="Message"
                                    multiline
                                    placeholder="Write a message (Optional)..."
                                    style={{ width: "100%" }}
                                    onChange={(event) =>
                                        setSupportPetitionMessage(event.target.value)
                                    }
                                />
                                <Typography style={{ marginTop: "10px" }} variant="subtitle1">
                                    Select support tier:
                                </Typography>
                                <Select
                                    style={{ width: "100%" }}
                                    value={supportPetitionTierId}
                                    onChange={handleSupportPetitionTierChange}
                                >
                                    {supportTiers.length >= 1 &&
                                        !supporters.some(
                                            (supporter) =>
                                                supporter.supporterId === authUser.userId &&
                                                supporter.supportTierId ===
                                                supportTiers.at(0)?.supportTierId,
                                        ) && (
                                            <MenuItem value={supportTiers.at(0)?.supportTierId}>
                                                {supportTiers.at(0)?.title}
                                            </MenuItem>
                                        )}
                                    {supportTiers.length >= 2 &&
                                        !supporters.some(
                                            (supporter) =>
                                                supporter.supporterId === authUser.userId &&
                                                supporter.supportTierId ===
                                                supportTiers.at(1)?.supportTierId,
                                        ) && (
                                            <MenuItem value={supportTiers.at(1)?.supportTierId}>
                                                {supportTiers.at(1)?.title}
                                            </MenuItem>
                                        )}
                                    {supportTiers.length >= 3 &&
                                        !supporters.some(
                                            (supporter) =>
                                                supporter.supporterId === authUser.userId &&
                                                supporter.supportTierId ===
                                                supportTiers.at(2)?.supportTierId,
                                        ) && (
                                            <MenuItem value={supportTiers.at(2)?.supportTierId}>
                                                {supportTiers.at(2)?.title}
                                            </MenuItem>
                                        )}
                                </Select>
                            </div>
                        </DialogContentText>
                        <DialogActions
                            style={{
                                justifyContent: "center",
                                height: "100%",
                                paddingTop: "30px",
                                display: "flex",
                            }}
                        >
                            <Button
                                style={{ width: "100%", height: "50px" }}
                                variant="contained"
                                onClick={() => setOpenSupportDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                style={{ width: "100%", height: "50px" }}
                                variant="contained"
                                color="success"
                                disableElevation
                                onClick={handleSupportPetition}
                            >
                                Submit
                            </Button>
                        </DialogActions>
                    </DialogContent>
                )}
                <DialogContent></DialogContent>
            </Dialog>
        </div>
    );
};

export default Petition;
