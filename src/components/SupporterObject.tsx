import { TableRow, TableCell } from "@mui/material";
import defaultImage from "../resources/default_profile_image.png";
import BASE_URL from "../config";
import axios from "axios";
import React from "react";

interface ISupporterProps {
    supporter: Supporter;
    supportTiers: SupportTier[];
}

const SupporterObject = (props: ISupporterProps) => {
    const { supporter, supportTiers } = props;
    const [supporterImageUrl, setSupporterImageUrl] = React.useState("");

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

    const supportTierTitle = () => {
        const tier = supportTiers.find(
            (supportTier: SupportTier) =>
                supportTier.supportTierId === supporter.supportTierId,
        );
        return tier ? tier.title : "";
    };

    React.useEffect(() => {
        axios
            .get(BASE_URL + "/users/" + supporter.supporterId + "/image", {
                responseType: "blob",
            })
            .then((response) => {
                const url = URL.createObjectURL(response.data);
                setSupporterImageUrl(url);
            })
            .catch((error) => {
                console.log(error.toString());
            });
    }, []);

    return (
        <TableRow key={supporter.timestamp}>
            <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                        src={supporterImageUrl}
                        alt=""
                        id="profile-image"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = defaultImage;
                        }}
                        style={{ marginRight: "10px" }}
                    />{" "}
                    {supporter.supporterFirstName} {supporter.supporterLastName}
                </div>
            </TableCell>
            <TableCell>{supportTierTitle()}</TableCell>
            <TableCell>{formatDate(new Date(supporter.timestamp))}</TableCell>
            <TableCell>{supporter.message}</TableCell>
        </TableRow>
    );
};

export default SupporterObject;
