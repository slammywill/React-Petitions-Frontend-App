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
import { useNavigate } from "react-router-dom";
import { InsertPhoto } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CreatePetition = () => {
  const authUser = useAuthUserStore((state) => state.authUser);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState(Number(NaN));
  const [image, setImage] = React.useState<File | null>(null);
  const [mainError, setMainError] = React.useState("");
  const [mainErrorFlag, setMainErrorFlag] = React.useState(false);

  const [titleError, setTitleError] = React.useState("");
  const [descriptionError, setDescriptionError] = React.useState("");

  const [titleErrorFlag, setTitleErrorFlag] = React.useState(false);
  const [descriptionErrorFlag, setDescriptionErrorFlag] = React.useState(false);

  const [t1Title, setT1Title] = React.useState("");
  const [t1Description, setT1Description] = React.useState("");
  const [t1Cost, setT1Cost] = React.useState(NaN);
  const [t1CostValue, setT1CostValue] = React.useState("");

  const [t2Title, setT2Title] = React.useState("");
  const [t2Description, setT2Description] = React.useState("");
  const [t2Cost, setT2Cost] = React.useState(NaN);
  const [t2CostValue, setT2CostValue] = React.useState("");

  const [t3Title, setT3Title] = React.useState("");
  const [t3Description, setT3Description] = React.useState("");
  const [t3Cost, setT3Cost] = React.useState(NaN);
  const [t3CostValue, setT3CostValue] = React.useState("");

  const paperStyle: CSS.Properties = {
    padding: "50px",
    margin: "100px",
    display: "grid",
    width: "33%",
    minWidth: "400px",
  };

  const validateTitle = () => {
    if (title !== "") {
      setTitleError("");
      setTitleErrorFlag(false);
    } else {
      setTitleError("Title must not be empty");
      setTitleErrorFlag(true);
    }
  };

  const validateDescription = () => {
    if (description !== "") {
      setDescriptionError("");
      setDescriptionErrorFlag(false);
    } else {
      setDescriptionError("Description must not be empty");
      setDescriptionErrorFlag(true);
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(Number(event.target.value));
  };

  const sendImage = (petitonId: Number) => {
    if (authUser && authUser.userId && image) {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);

          await axios.put(
            BASE_URL + "/petitions/" + petitonId + "/image",
            uint8Array,
            {
              headers: {
                "Content-Type": image.type,
                "X-Authorization": authUser.token,
              },
            },
          );

          console.log("Image uploaded successfully");
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      };

      reader.readAsArrayBuffer(image);
    }
  };

  const handleCreatePetition = () => {
    if (
      !titleError &&
      authUser &&
      !descriptionError &&
      t1Title !== "" &&
      t1Description !== "" &&
      !isNaN(Number(t1Cost))
    ) {
      const supportTiers = [
        {
          title: t1Title,
          description: t1Description,
          cost: t1Cost,
        },
      ];

      if (t2Title !== "" && t2Description !== "" && !isNaN(Number(t2Cost))) {
        supportTiers.push({
          title: t2Title,
          description: t2Description,
          cost: t2Cost,
        });
      }

      if (t3Title !== "" && t3Description !== "" && !isNaN(Number(t3Cost))) {
        supportTiers.push({
          title: t3Title,
          description: t3Description,
          cost: t3Cost,
        });
      }

      axios
        .post(
          BASE_URL + "/petitions",
          {
            title: title,
            description: description,
            categoryId: category,
            supportTiers: supportTiers,
          },
          {
            headers: {
              "X-Authorization": authUser.token,
            },
          },
        )
        .then((response) => {
          sendImage(response.data.petitionId);
          setMainError("");
          setMainErrorFlag(false);
          navigate("/");
        })
        .catch((error) => {
          setMainError(error.toString());
          setMainErrorFlag(true);
        });
    }
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

  return (
    <div>
      <div>
        <Navbar />
      </div>
      {!authUser && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Alert severity="error" style={{ paddingRight: "50px" }}>
            <AlertTitle>Error</AlertTitle>
            You must be logged in to create a petition
          </Alert>
        </div>
      )}
      {authUser && (
        <div
          style={{
            justifyContent: "center",
            width: "fill",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Paper style={paperStyle} elevation={3}>
            <Typography variant="h2">Create Petition</Typography>
            <FormControl style={{ display: "flex", margin: "50px 0 0 0" }}>
              <TextField
                label="Title"
                error={!!titleErrorFlag}
                size="medium"
                placeholder="Enter a title..."
                style={{ width: "100%" }}
                aria-describedby="title-error-text"
                onChange={(event) => setTitle(event.target.value)}
                onBlur={validateTitle}
              />
              <FormHelperText
                style={{ color: "#e15141" }}
                id="title-error-text"
              >
                {titleError}
              </FormHelperText>
            </FormControl>
            <FormControl style={{ display: "flex", margin: "30px 0 0 0" }}>
              <TextField
                label="Description"
                multiline
                maxRows={4}
                error={!!descriptionErrorFlag}
                size="medium"
                placeholder="Enter a description..."
                style={{ width: "100%" }}
                onChange={(event) => setDescription(event.target.value)}
                onBlur={validateDescription}
              />
              <FormHelperText
                style={{ color: "#e15141" }}
                id="description-error-text"
              >
                {descriptionError}
              </FormHelperText>
            </FormControl>
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
              Upload a Picture
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
                Support Tiers
              </Typography>
              <Typography variant="body2">
                Add 1-3 support tiers for your supporters
              </Typography>
              <Accordion style={{ marginTop: "10px" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  Support Tier 1
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    fullWidth
                    label="Title"
                    onChange={(e) => setT1Title(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    style={{ marginTop: "5px" }}
                    onChange={(e) => setT1Description(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Cost"
                    value={t1CostValue}
                    style={{ marginTop: "5px" }}
                    onChange={handleT1CostChange}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  Support Tier 2 (Optional)
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    fullWidth
                    label="Title"
                    onChange={(e) => setT2Title(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    style={{ marginTop: "5px" }}
                    onChange={(e) => setT2Description(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Cost"
                    value={t2CostValue}
                    style={{ marginTop: "5px" }}
                    onChange={handleT2CostChange}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  Support Tier 3 (Optional)
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    fullWidth
                    label="Title"
                    onChange={(e) => setT3Title(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    style={{ marginTop: "5px" }}
                    onChange={(e) => setT3Description(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Cost"
                    value={t3CostValue}
                    style={{ marginTop: "5px" }}
                    onChange={handleT3CostChange}
                  />
                </AccordionDetails>
              </Accordion>
            </div>
            <Typography variant="subtitle1" style={{ color: "#e15141" }}>
              {mainError}
            </Typography>
            <div>
              <Button
                variant="contained"
                size="large"
                onClick={handleCreatePetition}
                style={{
                  marginTop: "30px",
                  width: "50%",
                }}
              >
                Create Petition
              </Button>
            </div>
          </Paper>
        </div>
      )}
    </div>
  );
};

export default CreatePetition;
