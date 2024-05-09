import React from "react";
import axios from "axios";
import CSS from 'csstype';
import { Card, Button, CardActions, CardContent, CardMedia, Dialog, Typography } from "@mui/material";

interface IPetitionProps {
    petition: Petition
}

const PetitionsObject = (props: IPetitionProps) => {
    const [petition] = React.useState<Petition>(props.petition)
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const [imageUrl, setImageUrl] = React.useState("");

    React.useEffect(() => {
        axios.get("http://localhost:4941/api/v1/petitions/" + petition.petitionId + "/image", {responseType: 'blob' })
            .then( response =>  {
                const url = URL.createObjectURL(response.data);
                setImageUrl(url);
            })
            .catch(error => {
                console.error(error.toString());
            })
    }, [])

    const petitionCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "350px",
        width: "300px",
        margin: "10px",
        padding: "0px"
    }

    return (
        <Card sx={petitionCardStyles}>
            <CardMedia
                component="img"
                height="200px"
                width="200px"
                sx={{objectFit:"cover"}}
                src={imageUrl}
                alt="Petition Image"
            />
            <CardContent>
                <Typography variant="h4">
                    {petition.title}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default PetitionsObject;
