import Navbar from "./Navbar";
import {
  FormHelperText,
  Paper,
  Typography,
  FormControl,
  Link,
  TextField,
  Button,
  Avatar,
} from "@mui/material";
import CSS from "csstype";
import React from "react";
import * as EmailValidator from "email-validator";
import BASE_URL from "../config";
import axios from "axios";
import { useAuthUserStore } from "../store";
import { useNavigate } from "react-router-dom";
import defaultImage from "../resources/default_profile_image.png";

const Register = () => {
  const authUser = useAuthUserStore((state) => state.authUser);
  const setAuthUser = useAuthUserStore((state) => state.setAuthUser);
  const navigate = useNavigate();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  const [emailError, setEmailError] = React.useState("");
  const [emailErrorFlag, setEmailErrorFlag] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState("");
  const [passwordErrorFlag, setPasswordErrorFlag] = React.useState(false);
  const [registerError, setRegisterError] = React.useState("");
  const [registerErrorFlag, setRegisterErrorFlag] = React.useState(false);
  const [registered, setRegistered] = React.useState(false);

  const [profileImage, setProfileImage] = React.useState<File | null>(null);

  const paperStyle: CSS.Properties = {
    padding: "50px",
    margin: "100px",
    display: "grid",
    width: "33%",
    minWidth: "400px",
  };

  const sendImage = () => {
    if (authUser && authUser.userId && profileImage) {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);

          await axios.put(
            BASE_URL + "/users/" + authUser.userId + "/image",
            uint8Array,
            {
              headers: {
                "Content-Type": profileImage.type,
                "X-Authorization": authUser.token,
              },
            },
          );

          console.log("Image uploaded successfully");
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      };

      reader.readAsArrayBuffer(profileImage);
    }
  };

  React.useEffect(() => {
    if (authUser) {
      setRegisterError(
        "You cannot register if you are already logged in. Please log out to register a new account",
      );
      setRegisterErrorFlag(true);
    } else {
      setRegisterError("");
      setRegisterErrorFlag(false);
    }
  }, []);

  React.useEffect(() => {
        sendImage();
  }, [authUser]);

  const handleCreateAccount = () => {
    axios
      .post(BASE_URL + "/users/register", {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
      })
      .then((response) => {
        setRegistered(true);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setRegisterError("Bad Request: Invalid information");
        } else if (error.response.status === 403) {
          setEmailError("This email address is already in use");
          setEmailErrorFlag(true);
        } else if (error.response.status === 500) {
          setRegisterError("Server Error");
        } else {
          setRegisterError(error.toString());
        }
      });
  };

  React.useEffect(() => {
    if (registered) {
      axios
        .post(BASE_URL + "/users/login", {
          email: email,
          password: password,
        })
        .then((response) => {
          setAuthUser(response.data);
          navigate("/");
        });
    }
  }, [registered]);

  const validateEmail = (value: string) => {
    setEmail(value);
    if (EmailValidator.validate(email)) {
      setEmailErrorFlag(false);
      setEmailError("");
    } else {
      setEmailErrorFlag(true);
      setEmailError("Not a valid email address");
    }
  };

  const validatePassword = (value: string) => {
    setPassword(value);
    if (password.length >= 6) {
      setPasswordErrorFlag(false);
      setPasswordError("");
    } else {
      setPasswordErrorFlag(true);
      setPasswordError("Password must be at least 6 characters");
    }
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div
        style={{
          justifyContent: "center",
          width: "fill",
          alignItems: "center",
          display: "flex",
        }}
      >
        <Paper style={paperStyle} elevation={3}>
          <Typography variant="h2">Register</Typography>
          <FormControl style={{ display: "flex", margin: "30px 0 0 0" }}>
            <TextField
              label="First Name"
              size="medium"
              placeholder="Enter your first name..."
              style={{ width: "100%" }}
              aria-describedby="first-name-error-text"
              onChange={(event) => setFirstName(event.target.value)}
            />
          </FormControl>
          <FormControl style={{ display: "flex", margin: "30px 0 0 0" }}>
            <TextField
              label="Last Name"
              size="medium"
              placeholder="Enter your last name..."
              style={{ width: "100%" }}
              aria-describedby="last-name-error-text"
              onChange={(event) => setLastName(event.target.value)}
            />
          </FormControl>
          <FormControl style={{ display: "flex", margin: "30px 0 0 0" }}>
            <TextField
              error={!!emailErrorFlag && email !== ""}
              label="Email Address"
              size="medium"
              placeholder="Enter your email address..."
              type="email"
              style={{ width: "100%" }}
              aria-describedby="email-error-text"
              onChange={(event) => validateEmail(event.target.value)}
              onBlur={(event) => validateEmail(event.target.value)}
            />
            <FormHelperText id="email-error-text" style={{ color: "#e15141" }}>
              {email !== "" && emailError}
            </FormHelperText>
          </FormControl>
          <FormControl style={{ display: "flex", margin: "30px 0 0 0" }}>
            <TextField
              error={!!passwordErrorFlag && password !== ""}
              label="Password"
              size="medium"
              placeholder="Enter your password"
              type="password"
              style={{ width: "100%" }}
              aria-describedby="password-error-text"
              onChange={(event) => validatePassword(event.target.value)}
              onBlur={(event) => validatePassword(event.target.value)}
            />
          </FormControl>
          <FormHelperText id="password-error-text" style={{ color: "#e15141" }}>
            {password !== "" && passwordError}
          </FormHelperText>
          <Typography variant="body1" style={{ color: "#e15141" }}>
            {registerError}
          </Typography>
          <Typography variant="h6" style={{ marginTop: "30px" }}>
            Add a Profile Picture
          </Typography>
          <Typography variant="h6">(Optional)</Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "20px",
              justifyContent: "center",
            }}
          >
            <Avatar
              alt="Profile Picture"
              src={
                profileImage ? URL.createObjectURL(profileImage) : defaultImage
              }
              style={{
                objectFit: "cover",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
              }}
              onClick={() => fileInputRef.current?.click()}
            />
            <input
              type="file"
              accept="image/jpeg, image/jpg, image/png, image/gif"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setProfileImage(e.target.files[0]);
                }
              }}
            />
          </div>
          <div>
            <Button
              disabled={
                !!emailErrorFlag ||
                lastName === "" ||
                firstName === "" ||
                !!passwordErrorFlag
              }
              variant="outlined"
              size="large"
              onClick={handleCreateAccount}
              style={{
                marginTop: "30px",
                width: "50%",
                marginBottom: "30px",
              }}
            >
              Register Account
            </Button>
          </div>
          <Link href="/Login">
            <Typography variant="subtitle1">
              Already have an account?
            </Typography>
          </Link>
          <div></div>
        </Paper>
      </div>
    </div>
  );
};

export default Register;
