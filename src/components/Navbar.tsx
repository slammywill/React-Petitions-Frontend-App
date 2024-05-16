import {AppBar, Toolbar, Typography, Button, ButtonGroup} from "@mui/material";
import '../index.css';
import { useAuthUserStore } from "../store";
import { useNavigate } from "react-router-dom";
import React from "react";

const Navbar = () => {
    const authUser = useAuthUserStore(state => state.authUser);
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        // Logout
    }

    return (
        <AppBar position="static">
            <Toolbar>
                    <a href="/" id="logo">
                        <h2><i>PetitionPal</i></h2>
                    </a>
                <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }}>
                    <ButtonGroup color="inherit" variant="text" size="large">
                            <Button id="profileButton" disabled={!authUser} onClick={() => navigate("/Profile")}>Profile</Button>
                            <Button id="petitionsButton" onClick={() => navigate("/")}>Petitions</Button>
                    </ButtonGroup>
                </Typography>
                <ButtonGroup color="inherit" variant="text" size="large">
                        <Button id="loginButton" disabled={!!authUser} onClick={() => navigate("/Login")}>Login</Button>
                        <Button id="logoutButton" disabled={!authUser} onClick={handleLogoutClick}>Logout</Button>
                </ButtonGroup>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar;
