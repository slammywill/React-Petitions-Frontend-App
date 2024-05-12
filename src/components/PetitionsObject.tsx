import React from "react";
import "../App.css";
import defaultImage from "../resources/default_profile_image.png";
import axios from "axios";
import CSS from 'csstype';
import { Card, Button, CardActions, CardContent, CardMedia, Dialog, Typography } from "@mui/material";

interface IPetitionProps {
    petition: Petition
}


const PetitionsObject = (props: IPetitionProps) => {
    const [petition] = React.useState<Petition>(props.petition)
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
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

    let categoryMap = new Map<number, string>([
        [1, "Wildlife"],
        [2, "Environmental Causes"],
        [3, "Animal Rights"],
        [4, "Health and Wellness"],
        [5, "Education"],
        [6, "Human Rights"],
        [7, "Technoligy and Innovation"],
        [8, "Arts and Culture"],
        [9, "Community Development"],
        [10, "Economic Empowerment"],
        [11, "Science and Research"],
        [12, "Sports and Recreation"]
    ]);

    const petitionCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "520px",
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
            <CardContent>
                <Typography variant="h6">
                    {petition.title}
                </Typography>
                <div style={{display: "block"}}>
                    <p>{petition.ownerFirstName} {petition.ownerLastName}</p>
                    <img
                        src={ownerImageUrl}
                        alt=""
                        id="profile-image"
                        onError={(e) => {(e.target as HTMLImageElement).src = defaultImage}}
                    />
                    <p>Created: {petition.creationDate}</p>
                    <p>Category: {categoryMap.get(petition.categoryId)}</p>
                    <p>Minimum tier supporting cost: ${petition.supportingCost}.00</p>
                </div>
            </CardContent>
        </Card>
    )
}

export default PetitionsObject;
