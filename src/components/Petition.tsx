import Navbar from "./Navbar";
import CSS from "csstype";
import {Alert, AlertTitle, Paper, Typography} from "@mui/material";
import React from "react";
import axios from "axios";
import BASE_URL from "../config";
import {useNavigate, useParams} from "react-router-dom";
import defaultImage from "../resources/default_profile_image.png";

const Petition = () => {
    const [petition, setPetition] = React.useState<SinglePetition>({} as SinglePetition);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const { id } = useParams();
    const [petitionImageUrl, setPetitionImageUrl] = React.useState("");
    const [ownerImageUrl, setOwnerImageUrl] = React.useState("");

    React.useEffect(() => {
        axios.get(BASE_URL + "/petitions/" + id)
            .then(response => {
                setPetition(response.data);
                setErrorFlag(false);
                setErrorMessage("");
            })
            .catch(error => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            })
    }, [id])

    React.useEffect(() => {
        if (petition) {
            axios.get(BASE_URL + "/petitions/" + petition.petitionId + "/image", {responseType: 'blob' })
                .then( response =>  {
                    const url = URL.createObjectURL(response.data);
                    setPetitionImageUrl(url);
                })
                .catch(error => {
                    console.error(error.toString());
                })
        }
    }, [petition])

    React.useEffect(() => {
        if (petition) {
            axios.get(BASE_URL + "/users/" + petition.ownerId + "/image", {responseType: 'blob' })
                .then( response =>  {
                    const url = URL.createObjectURL(response.data);
                    setOwnerImageUrl(url);
                })
                .catch(error => {
                    console.log(error.toString());
                    setOwnerImageUrl(defaultImage);
                })
        }
    }, [petition])

    function formatDate(date: Date): string {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${day} ${month}, ${year} at ${formattedHours}:${formattedMinutes}${ampm}`;
    }


    const paperStyle: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "grid",
        width: "fill"
    }

    return (
        <div>
            <div>
                <Navbar />
            </div>
            {errorFlag &&
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>}
            <Paper style={paperStyle} elevation={3}>
                <div style={{display:"flex", padding:"50px"}}>
                    {petitionImageUrl &&
                        <div>
                            <img
                                src={petitionImageUrl}
                                alt="Petition"
                                style={{
                                    objectFit: "cover",
                                    width: "400px",
                                    height: "400px",
                                    borderRadius: "20px",
                                }}
                            />
                        </div>
                    }
                    <div style={{width:"fill", height:"100%", marginLeft:"50px", textAlign:"left"}}>
                        <Typography variant="h2">{petition.title}</Typography>
                        <div style={{display: "flex", alignItems:"center"}}>
                            <img
                                src={ownerImageUrl}
                                alt="Owner"
                                style={{
                                    objectFit: "cover",
                                    width: "65px",
                                    height: "65px",
                                    borderRadius: "50%",
                                    marginRight: "20px"
                                }}
                            />
                            <Typography variant="h5">
                                {petition.ownerFirstName} {petition.ownerLastName}
                            </Typography>
                        </div>
                        <br />
                        <Typography variant="body1">{petition.description}</Typography>
                        <br />
                        <Typography variant="body1" >This petition has {petition.numberOfSupporters} {petition.numberOfSupporters === 1 ? "supporter" : "supporters"}.</Typography>
                        <Typography variant="body1">This petition has raised ${petition.moneyRaised}.00.</Typography>
                    </div>
                </div>
            </Paper>
        </div>
    )
}

export default Petition;
