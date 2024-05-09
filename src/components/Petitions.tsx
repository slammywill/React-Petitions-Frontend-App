import React from "react";
import axios from "axios";
import CSS from "csstype";
import PetitionsObject from "./PetitionsObject";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Paper, AlertTitle, Alert } from "@mui/material";

const Petitions = () => {
    const [petitions, setPetitions] = React.useState<Array<Petition>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const getPetitions = () => {
        axios.get("http://localhost:4941/api/v1/petitions")
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setPetitions(response.data.petitions)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    React.useEffect(() => {
        getPetitions()
    }, [setPetitions])

    const petition_rows = () => petitions.map((petition: Petition) => <PetitionsObject key={ petition.petitionId } petition={petition}/>)

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "block",
        width: "fit-content"
    }

    return (
        <Paper elevation={3} style={card} >
            <h1>Petition List</h1>
            <div style={{ display: "inline-block",  minWidth: "320px" }}>
                {errorFlag?
                    <Alert severity = "error">
                        <AlertTitle>Error</AlertTitle>
                        { errorMessage }
                    </Alert>: ""}
               { petition_rows() }
            </div>
        </Paper>
    )
}

export default Petitions;
