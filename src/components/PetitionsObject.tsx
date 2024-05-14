import React from "react";
import "../App.css";
import defaultImage from "../resources/default_profile_image.png";
import axios from "axios";
import CSS from 'csstype';
import { Card, Button, CardActions, CardContent, CardMedia, Dialog, Typography } from "@mui/material";

interface IPetitionProps {
    petition: Petition
    onOpenDeleteDialog: (p: Petition) => void
}


const PetitionsObject = (props: IPetitionProps) => {
    const { petition, onOpenDeleteDialog } = props;
    const [petitionImageUrl, setPetitionImageUrl] = React.useState("");
    const [ownerImageUrl, setOwnerImageUrl] = React.useState("");

    React.useEffect(() => {
        axios.get("http://localhost:4941/api/v1/petitions/" + petition.petitionId + "/image", {responseType: 'blob' })
            .then( response =>  {
                const url = URL.createObjectURL(response.data);
                setPetitionImageUrl(url);
            })
            .catch(error => {
                console.error(error.toString());
            })
    }, [])

    React.useEffect(() => {
        axios.get("http://localhost:4941/api/v1/users/" + petition.ownerId + "/image", {responseType: 'blob' })
            .then( response =>  {
                const url = URL.createObjectURL(response.data);
                setOwnerImageUrl(url);
            })
            .catch(error => {
                console.log(error.toString());
            })
    }, [])

    React.useEffect(() => {
        axios.get("http://localhost:4941/api/v1/petitions/" + petition.petitionId)
            .then(response => {
                petition.description = response.data.description;
            })
            .catch(error => {
                console.error(error.toString());
                petition.description = "";
            })
        }, [])

    let categoryMap = new Map<number, string>([
        [1, "Wildlife"],
        [2, "Environmental Causes"],
        [3, "Animal Rights"],
        [4, "Health and Wellness"],
        [5, "Education"],
        [6, "Human Rights"],
        [7, "Technology and Innovation"],
        [8, "Arts and Culture"],
        [9, "Community Development"],
        [10, "Economic Empowerment"],
        [11, "Science and Research"],
        [12, "Sports and Recreation"]
    ]);

    const petitionCardStyles: CSS.Properties = {
        display: "inline-grid",
        position:"relative",
        height: "650px",
        width: "300px",
        margin: "10px",
        padding: "0px",
        alignItems: "start",
    }

    return (
        <Card sx={petitionCardStyles}>
            <CardMedia
                component="img"
                height="200px"
                width="300px"
                sx={{objectFit:"cover"}}
                src={petitionImageUrl}
                alt="Petition Image"
            />
            <CardContent style={{ display: "flex", flexDirection: "column", height: "90%" }}>
                <div style={{ flexGrow: 1 }}>
                    <Typography variant="h6">
                        {petition.title}
                    </Typography>
                    <div style={{ display: "block" }}>
                        <p>{petition.ownerFirstName} {petition.ownerLastName}</p>
                        <img
                            src={ownerImageUrl}
                            alt=""
                            id="profile-image"
                            onError={(e) => { (e.target as HTMLImageElement).src = defaultImage }}
                        />
                        <p>Created: {petition.creationDate}</p>
                        <p>Category: {categoryMap.get(petition.categoryId)}</p>
                        <p>Minimum tier supporting cost: ${petition.supportingCost}.00</p>
                    </div>
                </div>
                <CardActions style={{ display: "flex", justifyContent: "space-between"}}>
                    <Button size="large" variant="contained" style={{width:"100%"}}>
                        View
                    </Button>
                    <Button size="large"
                        variant="contained"
                        style={{width:"100%"}}
                        onClick={() => onOpenDeleteDialog(petition)}>
                        Delete
                    </Button>
                </CardActions>
            </CardContent>
        </Card>
    )
}

export default PetitionsObject;
