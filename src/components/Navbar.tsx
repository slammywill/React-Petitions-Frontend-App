import {AppBar, Toolbar, Typography, Button, ButtonGroup, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText} from "@mui/material";
import '../index.css';
import { useAuthUserStore } from "../store";
import { useNavigate } from "react-router-dom";
import React from "react";

const Navbar = () => {
    const authUser = useAuthUserStore(state => state.authUser);
    const removeAuthUser = useAuthUserStore(state => state.removeAuthUser);
    const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false) 
    const navigate = useNavigate();

    const handleLogoutDialogOpen = () => {
        setOpenLogoutDialog(true);
    }

    const handleLogoutDialogClose = () => {
        setOpenLogoutDialog(false);
    }

    // Go back to last page on modal buttons

    return (
        <div>
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
                        <Button id="logoutButton" disabled={!authUser} onClick={handleLogoutDialogOpen}>Logout</Button>
                    </ButtonGroup>
                </Toolbar>
            </AppBar>
            <Dialog
                open={openLogoutDialog}
                onClose={handleLogoutDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{textAlign:"center"}}
            >
                <DialogTitle id="alert-dialog-title">
                    Log Out
                </DialogTitle>
                    <DialogContent
                        style={{ display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            paddingBottom:"0"}}
                    >
                        <DialogContentText
                            id="alert-dialog-description"
                            style={{paddingTop:"10px"}}>
                            Are you sure you want to log out?
                        </DialogContentText>
                        <DialogActions style={{
                            justifyContent:"center",
                            height:"100%",
                            paddingTop:"40px"
                        }}>
                            <Button
                                style={{width:"100%", height:"50px"}}
                                variant="outlined"
                                onClick={handleLogoutDialogClose}>
                                Cancel
                            </Button>
                            <Button
                                style={{ width:"100%", height:"50px"}}
                                variant="contained"
                                color="error"
                                disableElevation
                                onClick={() => removeAuthUser()}>
                                Log Out
                            </Button>
                        </DialogActions>
                    </DialogContent>
                <DialogContent>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Navbar;
