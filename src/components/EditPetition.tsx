import {
    Alert,
    AlertTitle,
    Paper,
    Avatar,
    TextField,
    Typography,
    FormHelperText,
    FormControl,
    Button,
    MenuItem,
    Select,
    SelectChangeEvent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import CSS from "csstype";
import Navbar from "./Navbar";
import React from "react";
import BASE_URL from "../config";
import axios from "axios";
import { useAuthUserStore } from "../store";
import { useNavigate, useParams } from "react-router-dom";
import { InsertPhoto } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const EditPetition = () => {
    const authUser = useAuthUserStore((state) => state.authUser);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { id } = useParams();

    const [petition, setPetition] = React.useState<SinglePetition>(
        {} as SinglePetition,
    );
    const [category, setCategory] = React.useState(Number(NaN));
    const [image, setImage] = React.useState<File | null>(null);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [supportTiers, setSupportTiers] = React.useState<Array<SupportTier>>(
        [],
    );
    const [supporters, setSupporters] = React.useState<Array<Supporter>>([]);

    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");

    const [titleError, setTitleError] = React.useState("");
    const [titleErrorFlag, setTitleErrorFlag] = React.useState(false);
    const [descriptionError, setDescriptionError] = React.useState("");
    const [descriptionErrorFlag, setDescriptionErrorFlag] = React.useState(false);

    const [t1Title, setT1Title] = React.useState("");
    const [t1Description, setT1Description] = React.useState("");
    const [t1Cost, setT1Cost] = React.useState(NaN);
    const [t1CostValue, setT1CostValue] = React.useState("");
    const [t1Valid, setT1Valid] = React.useState(false);

    const [t2Title, setT2Title] = React.useState("");
    const [t2Description, setT2Description] = React.useState("");
    const [t2Cost, setT2Cost] = React.useState(NaN);
    const [t2CostValue, setT2CostValue] = React.useState("");
    const [t2Valid, setT2Valid] = React.useState(false);

    const [t3Title, setT3Title] = React.useState("");
    const [t3Description, setT3Description] = React.useState("");
    const [t3Cost, setT3Cost] = React.useState(NaN);
    const [t3CostValue, setT3CostValue] = React.useState("");
    const [t3Valid, setT3Valid] = React.useState(false);

    const paperStyle: CSS.Properties = {
        padding: "50px",
        margin: "100px",
        display: "grid",
        width: "33%",
        minWidth: "400px",
    };

    const getPetition = () => {
        axios
            .get(BASE_URL + "/petitions/" + id)
            .then((response) => {
                setPetition(response.data);
                setSupportTiers(response.data.supportTiers);
                setTitle(response.data.title);
                setDescription(response.data.description);
                setCategory(response.data.categoryId);
                setErrorFlag(false);
                setErrorMessage("");
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
    };

    React.useEffect(() => {
        getPetition();
    }, []);

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
        const allEmpty = t1Title === "" && t1Description === "" && isNaN(t1Cost);
        const allNonEmpty =
            t1Title !== "" && t1Description !== "" && !isNaN(t1Cost);
        console.log(t1Cost);
        setT1Valid(allEmpty || allNonEmpty);
    }, [t1Title, t1Description, t1Cost]);

    React.useEffect(() => {
        const allEmpty = t2Title === "" && t2Description === "" && isNaN(t2Cost);
        const allNonEmpty =
            t2Title !== "" && t2Description !== "" && !isNaN(t2Cost);
        setT2Valid(allEmpty || allNonEmpty);
    }, [t2Title, t2Description, t2Cost]);

    React.useEffect(() => {
        const allEmpty = t3Title === "" && t3Description === "" && isNaN(t3Cost);
        const allNonEmpty =
            t3Title !== "" && t3Description !== "" && !isNaN(t3Cost);
        setT3Valid(allEmpty || allNonEmpty);
    }, [t3Title, t3Description, t3Cost]);

    React.useEffect(() => {
        if (supportTiers && supportTiers.length >= 1) {
            setT1Title(supportTiers[0].title);
            setT1Description(supportTiers[0].description);
            setT1CostValue(supportTiers[0].cost.toString());
            setT1Cost(supportTiers[0].cost);
        }
        if (supportTiers && supportTiers.length >= 2) {
            setT2Title(supportTiers[1].title);
            setT2Description(supportTiers[1].description);
            setT2CostValue(supportTiers[1].cost.toString());
            setT2Cost(supportTiers[1].cost);
        }
        if (supportTiers && supportTiers.length >= 3) {
            setT3Title(supportTiers[2].title);
            setT3Description(supportTiers[2].description);
            setT3CostValue(supportTiers[2].cost.toString());
            setT3Cost(supportTiers[2].cost);
        }
    }, [supportTiers]);

    const validateTitle = () => {
        if (title === "") {
            setTitleError("Title cannot be empty");
            setTitleErrorFlag(true);
        } else {
            setTitleError("");
            setTitleErrorFlag(false);
        }
    };

    const validateDescription = () => {
        if (description === "") {
            setDescriptionError("Description cannot be empty");
            setDescriptionErrorFlag(true);
        } else {
            setDescriptionError("");
            setDescriptionErrorFlag(false);
        }
    };

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setCategory(Number(event.target.value));
    };

    const handleT1CostChange: React.ChangeEventHandler<HTMLInputElement> = (
        event,
    ) => {
        const value = event.target.value;
        if (value === "" || /^[0-9]+$/.test(value)) {
            setT1CostValue(value);
            setT1Cost(Number(value));
        }
        if (value === "") {
            setT1Cost(NaN);
        }
    };

    const handleT2CostChange: React.ChangeEventHandler<HTMLInputElement> = (
        event,
    ) => {
        const value = event.target.value;
        if (value === "" || /^[0-9]+$/.test(value)) {
            setT2CostValue(value);
            setT2Cost(Number(value));
        }
        if (value === "") {
            setT2Cost(NaN);
        }
    };

    const handleT3CostChange: React.ChangeEventHandler<HTMLInputElement> = (
        event,
    ) => {
        const value = event.target.value;
        if (value === "" || /^[0-9]+$/.test(value)) {
            setT3CostValue(value);
            setT3Cost(Number(value));
        }
        if (value === "") {
            setT3Cost(NaN);
        }
    };

    const handleDeleteT1 = () => {
        if (supportTiers[0]) {
            deleteSupportTier(supportTiers[0]);
        }
    };

    const handleDeleteT2 = () => {
        if (supportTiers[1]) {
            deleteSupportTier(supportTiers[1]);
        }
    };
    const handleDeleteT3 = () => {
        if (supportTiers[2]) {
            deleteSupportTier(supportTiers[2]);
        }
    };

    const deleteSupportTier = (supportTier: SupportTier) => {
        axios
            .delete(
                BASE_URL +
                "/petitions/" +
                petition.petitionId +
                "/supportTiers/" +
                supportTier.supportTierId,
                {
                    headers: {
                        "X-Authorization": authUser?.token,
                    },
                },
            )
            .then((response) => {
                getPetition();
            })
            .catch((error) => {
                console.error(error.toString());
            });
    };

    return (
        <div>
            <div>
                <Navbar />
            </div>
            {(!authUser || authUser.userId !== petition.ownerId) && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                    }}
                >
                    <Alert severity="error" style={{ paddingRight: "50px" }}>
                        <AlertTitle>Error</AlertTitle>
                        You must be logged in and the owner of a petition to edit it.
                    </Alert>
                </div>
            )}
            {errorFlag && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                    }}
                >
                    <Alert severity="error" style={{ paddingRight: "50px" }}>
                        <AlertTitle>Error</AlertTitle>
                        Petition {id} does not exist.
                    </Alert>
                </div>
            )}
            {authUser && authUser.userId === petition.ownerId && !errorFlag && (
                <div
                    style={{
                        justifyContent: "center",
                        width: "fill",
                        alignItems: "center",
                        display: "flex",
                    }}
                >
                    <Paper style={paperStyle} elevation={3}>
                        <Typography variant="h2">Edit Petition</Typography>
                        <FormControl style={{ display: "flex", margin: "30px 0 0 0" }}>
                            <TextField
                                label="Title"
                                size="medium"
                                error={!!titleErrorFlag}
                                placeholder="Edit the title..."
                                value={title}
                                style={{ width: "100%" }}
                                aria-describedby="title-error-text"
                                onChange={(event) => setTitle(event.target.value)}
                                onBlur={validateTitle}
                            />
                        </FormControl>
                        <FormHelperText style={{ color: "#e15141" }} id="title-error-text">
                            {titleError}
                        </FormHelperText>
                        <FormControl style={{ display: "flex", margin: "30px 0 0 0" }}>
                            <TextField
                                label="Description"
                                size="medium"
                                error={!!descriptionErrorFlag}
                                placeholder="Edit the description..."
                                value={description}
                                style={{ width: "100%" }}
                                aria-describedby="description-error-text"
                                onChange={(event) => setDescription(event.target.value)}
                                onBlur={validateDescription}
                            />
                        </FormControl>
                        <FormHelperText
                            style={{ color: "#e15141" }}
                            id="description-error-text"
                        >
                            {descriptionError}
                        </FormHelperText>
                        <FormControl style={{ display: "flex", margin: "30px 25% 0 25%" }}>
                            <Typography variant="subtitle1">Category</Typography>
                            <Select
                                size="medium"
                                id="selectCategory"
                                value={category ? category.toString() : ""}
                                fullWidth
                                onChange={handleCategoryChange}
                            >
                                <MenuItem value={1}>Wildlife</MenuItem>
                                <MenuItem value={2}>Environmental Causes</MenuItem>
                                <MenuItem value={3}>Animal Rights</MenuItem>
                                <MenuItem value={4}>Health and Wellness</MenuItem>
                                <MenuItem value={5}>Education</MenuItem>
                                <MenuItem value={6}>Human Rights</MenuItem>
                                <MenuItem value={7}>Technology and Innovation</MenuItem>
                                <MenuItem value={8}>Arts and Culture</MenuItem>
                                <MenuItem value={9}>Community Development</MenuItem>
                                <MenuItem value={10}>Economic Empowerment</MenuItem>
                                <MenuItem value={11}>Science and Research</MenuItem>
                                <MenuItem value={12}>Sports and Recreation</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography variant="subtitle1" style={{ marginTop: "30px" }}>
                            Click picture to upload a new one
                        </Typography>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Avatar
                                alt="Profile Picture"
                                variant="rounded"
                                src={image ? URL.createObjectURL(image) : undefined}
                                style={{
                                    objectFit: "cover",
                                    width: "400px",
                                    height: "400px",
                                    border: "1px solid #555555",
                                    backgroundColor: "#141414",
                                }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <InsertPhoto sx={{ fontSize: 100, color: "white" }} />
                            </Avatar>
                            <input
                                type="file"
                                accept="image/jpeg, image/jpg, image/png, image/gif"
                                style={{ display: "none" }}
                                ref={fileInputRef}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setImage(e.target.files[0]);
                                    }
                                }}
                            />
                        </div>
                        <div>
                            <Typography variant="subtitle1" style={{ marginTop: "30px" }}>
                                Edit Support Tiers
                            </Typography>
                            <Accordion style={{ marginTop: "10px" }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    Support Tier 1
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TextField
                                        fullWidth
                                        disabled={
                                            supportTiers &&
                                            supportTiers[0] &&
                                            supporters &&
                                            supporters.some(
                                                (supporter) =>
                                                    supporter.supportTierId ===
                                                    supportTiers[0].supportTierId,
                                            )
                                        }
                                        value={t1Title}
                                        label="Title"
                                        onChange={(e) => setT1Title(e.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        disabled={
                                            supportTiers &&
                                            supportTiers[0] &&
                                            supporters &&
                                            supporters.some(
                                                (supporter) =>
                                                    supporter.supportTierId ===
                                                    supportTiers[0].supportTierId,
                                            )
                                        }
                                        value={t1Description}
                                        label="Description"
                                        style={{ marginTop: "5px" }}
                                        onChange={(e) => setT1Description(e.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        disabled={
                                            supportTiers &&
                                            supportTiers[0] &&
                                            supporters &&
                                            supporters.some(
                                                (supporter) =>
                                                    supporter.supportTierId ===
                                                    supportTiers[0].supportTierId,
                                            )
                                        }
                                        value={t1CostValue}
                                        label="Cost"
                                        style={{ marginTop: "5px" }}
                                        onChange={handleT1CostChange}
                                    />
                                    <Button
                                        variant="contained"
                                        color="error"
                                        style={{ marginTop: "15px" }}
                                        onClick={handleDeleteT1}
                                        disabled={
                                            (supportTiers &&
                                                supportTiers[0] &&
                                                supporters &&
                                                supporters.some(
                                                    (supporter) =>
                                                        supporter.supportTierId ===
                                                        supportTiers[0].supportTierId,
                                                )) ||
                                            supportTiers.length === 1
                                        }
                                    >
                                        Delete Tier
                                    </Button>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    Support Tier 2
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TextField
                                        fullWidth
                                        disabled={
                                            supportTiers &&
                                            supportTiers[1] &&
                                            supporters &&
                                            supporters.some(
                                                (supporter) =>
                                                    supporter.supportTierId ===
                                                    supportTiers[1].supportTierId,
                                            )
                                        }
                                        value={t2Title}
                                        label="Title"
                                        onChange={(e) => setT2Title(e.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        disabled={
                                            supportTiers &&
                                            supportTiers[1] &&
                                            supporters &&
                                            supporters.some(
                                                (supporter) =>
                                                    supporter.supportTierId ===
                                                    supportTiers[1].supportTierId,
                                            )
                                        }
                                        value={t2Description}
                                        label="Description"
                                        style={{ marginTop: "5px" }}
                                        onChange={(e) => setT2Description(e.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        disabled={
                                            supportTiers &&
                                            supportTiers[1] &&
                                            supporters &&
                                            supporters.some(
                                                (supporter) =>
                                                    supporter.supportTierId ===
                                                    supportTiers[1].supportTierId,
                                            )
                                        }
                                        label="Cost"
                                        value={t2CostValue}
                                        style={{ marginTop: "5px" }}
                                        onChange={handleT2CostChange}
                                    />
                                    <Button
                                        variant="contained"
                                        color="error"
                                        style={{ marginTop: "15px" }}
                                        onClick={handleDeleteT2}
                                        disabled={
                                            (supportTiers &&
                                                supportTiers[1] &&
                                                supporters &&
                                                supporters.some(
                                                    (supporter) =>
                                                        supporter.supportTierId ===
                                                        supportTiers[1].supportTierId,
                                                )) ||
                                            supportTiers.length === 1
                                        }
                                    >
                                        Delete Tier
                                    </Button>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    Support Tier 3
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TextField
                                        fullWidth
                                        disabled={
                                            supportTiers &&
                                            supportTiers[2] &&
                                            supporters &&
                                            supporters.some(
                                                (supporter) =>
                                                    supporter.supportTierId ===
                                                    supportTiers[2].supportTierId,
                                            )
                                        }
                                        value={t3Title}
                                        label="Title"
                                        onChange={(e) => setT3Title(e.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        disabled={
                                            supportTiers &&
                                            supportTiers[2] &&
                                            supporters &&
                                            supporters.some(
                                                (supporter) =>
                                                    supporter.supportTierId ===
                                                    supportTiers[2].supportTierId,
                                            )
                                        }
                                        value={t3Description}
                                        label="Description"
                                        style={{ marginTop: "5px" }}
                                        onChange={(e) => setT3Description(e.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        disabled={
                                            supportTiers &&
                                            supportTiers[2] &&
                                            supporters &&
                                            supporters.some(
                                                (supporter) =>
                                                    supporter.supportTierId ===
                                                    supportTiers[2].supportTierId,
                                            )
                                        }
                                        label="Cost"
                                        value={t3CostValue}
                                        style={{ marginTop: "5px" }}
                                        onChange={handleT3CostChange}
                                    />
                                    <Button
                                        variant="contained"
                                        color="error"
                                        style={{ marginTop: "15px" }}
                                        onClick={handleDeleteT3}
                                        disabled={
                                            (supportTiers &&
                                                supportTiers[2] &&
                                                supporters &&
                                                supporters.some(
                                                    (supporter) =>
                                                        supporter.supportTierId ===
                                                        supportTiers[2].supportTierId,
                                                )) ||
                                            supportTiers.length === 1
                                        }
                                    >
                                        Delete Tier
                                    </Button>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: "30px",
                            }}
                        >
                            <Button
                                size="large"
                                color="error"
                                variant="contained"
                                sx={{ width: "40%", marginRight: "5px" }}
                                onClick={() => navigate("/petitions/" + id)}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="large"
                                color="success"
                                variant="contained"
                                sx={{ width: "40%", marginLeft: "5px" }}
                                disabled={
                                    titleErrorFlag ||
                                    descriptionErrorFlag ||
                                    !t1Valid ||
                                    !t2Valid ||
                                    !t3Valid
                                }
                            >
                                Confirm Edit
                            </Button>
                        </div>
                    </Paper>
                </div>
            )}
        </div>
    );
};

export default EditPetition;
