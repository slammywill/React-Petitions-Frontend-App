import { Paper, TextField, Typography, FormHelperText, FormControl, Button, Link} from "@mui/material";
import CSS from "csstype";
import Navbar from "./Navbar";
import React from "react"
import BASE_URL from "../config";
import axios from "axios";
import { useAuthUserStore } from "../store";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [emailError, setEmailError] = React.useState("");
    const [passwordError, setPasswordError] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loginError, setLoginError] = React.useState("");
    const [loginErrorFlag, setLoginErrorFlag] = React.useState(false);
    const authUser = useAuthUserStore(state => state.authUser);
    const setAuthUser = useAuthUserStore(state => state.setAuthUser);
    const navigate = useNavigate();


    const paperStyle: CSS.Properties = {
        padding: "50px",
        margin: "100px",
        display: "grid",
        width: "33%",
        minWidth:"400px"
    }

    const handleLoginSubmit = () => {
        axios.post(BASE_URL + "/users/login", {
            email: email,
            password: password
        })
            .then((response) => {
                if (!authUser) {
                    setAuthUser(response.data);
                    setLoginError("");
                    setLoginErrorFlag(false);
                    navigate("/");

                } else {
                    setLoginError("User already logged in. Log out first to log into another account");
                    setLoginErrorFlag(true);
                }
            })
            .catch(error => {
                if (error.response.status === 400) {
                    setLoginError("Bad Request: Invalid information");
                } else if (error.response.status === 401) {
                    setLoginError("Incorrect email or password");
                } else if (error.response.status === 500) {
                    setLoginError("Server Error");
                } else {
                    setLoginError(error.toString());
                }
            })
    }

    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div style={{justifyContent:"center", width:"fill", alignItems:"center", display:"flex"}}>
                <Paper style={paperStyle} elevation={3}>
                    <Typography variant="h2">Login</Typography>
                    <FormControl style={{display:"flex",  margin:"50px 0 50px 0"}}>
                        <TextField
                            label="Email Address"
                            size="medium"
                            placeholder="Enter your email address..."
                            type="email"
                            style={{width:"100%"}}
                            aria-describedby="email-error-text"
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <FormHelperText id="email-error-text">{emailError}</FormHelperText>
                    </FormControl>
                    <FormControl style={{display:"flex"}}>
                        <TextField
                            label="Password"
                            size="medium"
                            placeholder="Enter your password..."
                            type="password"
                            style={{width:"100%"}}
                            aria-describedby="password-error-text"
                            onChange={(event) => setPassword(event.target.value)}

                        />
                        <FormHelperText id="password-error-text">{passwordError}</FormHelperText>
                    </FormControl>
                    <Typography variant="body2" style={{color:"#e15141", marginTop:"10px"}}><i>{loginError}</i></Typography>
                    <div>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={handleLoginSubmit}
                            style={{
                                marginTop:"50px",
                                width:"30%",
                                marginBottom:"50px"
                            }}
                        >
                            Log In
                        </Button>
                    </div>
                    <Link href="/Register">
                        <Typography variant="subtitle1">
                            Don't have an account yet?
                        </Typography>
                    </Link>
                </Paper>
            </div>
        </div>
    )
}

export default Login;
