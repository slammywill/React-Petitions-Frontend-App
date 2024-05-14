import {AppBar, Toolbar, Typography, Button, ButtonGroup} from "@mui/material";
import BASE_URL from "../config";
import '../index.css';

const Navbar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                    <a href="/" id="logo">
                        <h2><i>PetitionPal</i></h2>
                    </a>
                <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }}>
                    <ButtonGroup color="inherit" variant="text" size="large">
                        <a href="/Profile" style={{textDecoration:"none", color:"white"}}>
                            <Button>Profile</Button>
                        </a>
                        <a href="/" style={{textDecoration: "none", color: "white"}}>
                            <Button>Petitions</Button>
                        </a>
                    </ButtonGroup>
                </Typography>
                <ButtonGroup color="inherit" variant="text" size="large">
                    <a href="/Login" style={{textDecoration: "none", color: "white"}}>
                        <Button>Login</Button>
                    </a>
                    <a href="/Logout" style={{textDecoration: "none", color: "white"}}>
                        <Button>Logout</Button>
                    </a>
                </ButtonGroup>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar;