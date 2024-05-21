import { Alert, AlertTitle, Button } from "@mui/material"
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                }}
            >
                <Alert severity="error" style={{ paddingRight: "50px" }}>
                    <AlertTitle>Error</AlertTitle>
                    This page does not exist.
                </Alert>
            </div>
            <Button
                variant="contained"
                sx={{ marginTop: "10px" }}
                onClick={() => navigate("/")}
            >Back</Button>
        </div>
    )
};

export default NotFound;
