import Navbar from "./Navbar";
import * as EmailValidator from "email-validator";
import BASE_URL from "../config";
import axios from "axios";
import CSS from "csstype";
import React from "react";
import { useAuthUserStore } from "../store";
import { Paper, Avatar, Alert, AlertTitle, FormHelperText, Typography, Button, TextField, FormControl } from "@mui/material";
import defaultImage from "../resources/default_profile_image.png";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const authUser = useAuthUserStore(state => state.authUser);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [enableEdit, setEnableEdit] = React.useState(false);
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [oldPassword, setOldPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [user, setUser] = React.useState<User>();
    const [profileImage, setProfileImage] = React.useState<File | null>(null);
    const [edited, setEdited] = React.useState(false);
    const [hasImage, setHasImage] = React.useState(false);

    const [firstNameError, setFirstNameError] = React.useState("");
    const [lastNameError, setLastNameError] = React.useState("");
    const [emailError, setEmailError] = React.useState("");
    const [newPasswordError, setNewPasswordError] = React.useState("");
    const [oldPasswordError, setOldPasswordError] = React.useState("");

    const [firstNameErrorFlag, setFirstNameErrorFlag] = React.useState(false);
    const [lastNameErrorFlag, setLastNameErrorFlag] = React.useState(false);
    const [emailErrorFlag, setEmailErrorFlag] = React.useState(false);
    const [newPasswordErrorFlag, setNewPasswordErrorFlag] = React.useState(false);
    const [oldPasswordErrorFlag, setOldPasswordErrorFlag] = React.useState(false);

    const paperStyle: CSS.Properties = {
        padding: "50px",
        margin: "100px",
        display: "grid",
        width: "33%",
        minWidth: "400px"
    }

    React.useEffect(() => {
        if (authUser) {
            axios.get(BASE_URL + "/users/" + authUser.userId, {
                headers: {
                    "X-Authorization": authUser.token
                }
            })
                .then(response => {
                    setUser(response.data);
                    setFirstName(response.data.firstName);
                    setLastName(response.data.lastName);
                    setEmail(response.data.email);
                    setNewPassword("");
                    setOldPassword("");

                    setFirstNameErrorFlag(false);
                    setLastNameError("");
                    setLastNameErrorFlag(false);
                    setLastNameError("");
                    setEmailErrorFlag(false);
                    setEmailError("");
                    setOldPasswordErrorFlag(false);
                    setOldPasswordError("");
                    setNewPasswordErrorFlag(false);
                    setNewPassword("");
                })
                .catch(error => {
                    console.error(error.toString());
                })
        }
    }, [enableEdit, hasImage])

    function getMimeTypeFromExtension(file: File) {
        const filename = file.name.toLowerCase();
        const extension = filename.split('.').pop();
        switch (extension) {
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            case 'gif':
                return 'image/gif';
        }
    }

    React.useEffect(() => {
        if (authUser && authUser.userId && profileImage) {
            const reader = new FileReader();

            reader.onload = (event) => {
                if (event.target) {
                    const binaryData = event.target.result;

                    axios.put(BASE_URL + "/users/" + authUser.userId + "/image", binaryData, {
                        headers: {
                            "Content-Type": getMimeTypeFromExtension(profileImage),
                            "X-Authorization": authUser.token
                        },
                    }).then(response => {
                        console.log("Image uploaded successfully:", response);
                        navigate("/");
                    }).catch(error => {
                        console.error("Error uploading image:", error);
                    });
                };
            }

            reader.onerror = (error) => {
                console.error("Error reading the file:", error);
            };

            reader.readAsBinaryString(profileImage);
        }
    }, [edited]);

    React.useEffect(() => {
        if (authUser) {
            axios.get(BASE_URL + "/users/" + authUser.userId + "/image", { responseType: 'blob' })
                .then(response => {
                    setProfileImage(response.data);
                    setHasImage(true);
                })
                .catch(error => {
                    setHasImage(false);
                    console.log(error.toString());
                })
        }
    }, [user])

    const validateFirstName = () => {
        if (firstName === "") {
            setFirstNameError("First name cannot be empty");
            setFirstNameErrorFlag(true);
        } else {
            setFirstNameError("");
            setFirstNameErrorFlag(false);
        }
    }

    const validateLastName = () => {
        if (lastName === "") {
            setLastNameError("First name cannot be empty");
            setLastNameErrorFlag(true);
        } else {
            setLastNameError("");
            setLastNameErrorFlag(false);
        }
    }

    const validateEmail = () => {
        if (!EmailValidator.validate(email)) {
            setEmailError("Not a valid email address");
            setEmailErrorFlag(true);
        } else {
            setEmailError("");
            setEmailErrorFlag(false);
        }
    }

    const validateOldPassword = () => {
        if (oldPassword.length < 6) {
            setOldPasswordError("Password must be at least 6 characters");
            setOldPasswordErrorFlag(true);
        } else {
            setOldPasswordError("");
            setOldPasswordErrorFlag(false);
        }
    }

    const validateNewPassword = () => {
        if (newPassword !== "" && (newPassword.length < 6 || newPassword === oldPassword)) {
            setNewPasswordError("Password must be at least 6 characters and different to old password");
            setNewPasswordErrorFlag(true);
        } else {
            setNewPasswordError("");
            setNewPasswordErrorFlag(false);
        }
    }

    const handleEditProfile = () => {
        if (authUser) {

            let data = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                currentPassword: oldPassword,
                ...newPassword !== "" && { password: newPassword }
            }

            axios.patch(BASE_URL + "/users/" + authUser.userId, data,
                {
                    headers: {
                        "X-Authorization": authUser.token
                    }
                })
                .then((response) => {
                    setEdited(true);
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        setOldPasswordErrorFlag(true);
                        setOldPasswordError("Current password is not correct");
                    } else if (error.response.status === 403) {
                        setEmailErrorFlag(true);
                        setEmailError("This email address is already in use");
                    } else {
                        console.error(error.toString());
                    }
                    setEdited(false);
                })
        }
    }

    const handleDeleteProfileImage = () => {
        if (authUser) {
            axios.delete(BASE_URL + "/users/" + authUser.userId + "/image",
                {
                    headers: {
                        "X-Authorization": authUser.token
                    }
                })
                .then((response) => {
                    setHasImage(false);
                })
                .catch((error) => {
                    console.error(error.toString());
                })
        }
    }

    return (
        <div>
            <div>
                <Navbar />
            </div>
            {!authUser &&
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                    <Alert severity="error" style={{ paddingRight: "50px" }}>
                        <AlertTitle>Error</AlertTitle>
                        You must be logged in to view your profile
                    </Alert>
                </div>
            }
            {authUser &&
                <div style={{ justifyContent: "center", width: "fill", alignItems: "center", display: "flex" }}>
                    <Paper style={paperStyle} elevation={3}>
                        <Typography variant="h2">My Profile</Typography>
                        <FormControl style={{ display: "flex", margin: "30px 0 0 0" }}>
                            <TextField
                                label="First Name"
                                size="medium"
                                error={!!firstNameErrorFlag}
                                placeholder="Enter your first name..."
                                disabled={!enableEdit}
                                value={firstName}
                                style={{ width: "100%" }}
                                aria-describedby="first-name-error-text"
                                onChange={(event) => setFirstName(event.target.value)}
                                onBlur={validateFirstName}
                            />
                        </FormControl>
                        <FormHelperText style={{ color: "#e15141" }} id="first-name-error-text">{firstNameError}</FormHelperText>
                        <FormControl style={{ display: "flex", margin: "30px 0 0 0" }}>
                            <TextField
                                label="Last Name"
                                size="medium"
                                placeholder="Enter your last name..."
                                error={!!lastNameErrorFlag}
                                disabled={!enableEdit}
                                value={lastName}
                                style={{ width: "100%" }}
                                aria-describedby="last-name-error-text"
                                onChange={(event) => setLastName(event.target.value)}
                                onBlur={validateLastName}
                            />
                        </FormControl>
                        <FormHelperText style={{ color: "#e15141" }} id="last-name-error-text">{lastNameError}</FormHelperText>
                        <FormControl style={{ display: "flex", margin: "30px 0 0 0" }}>
                            <TextField
                                label="Email"
                                size="medium"
                                value={email}
                                disabled={!enableEdit}
                                error={!!emailErrorFlag}
                                placeholder="Enter your email address..."
                                style={{ width: "100%" }}
                                aria-describedby="email-error-text"
                                onChange={(event) => setEmail(event.target.value)}
                                onBlur={validateEmail}
                            />
                        </FormControl>
                        <FormHelperText style={{ color: "#e15141" }} id="email-error-text">{emailError}</FormHelperText>
                        <FormControl sx={{ display: "flex", marginTop: enableEdit ? "30px" : 0 }}>
                            <TextField
                                label="Current Password"
                                type="password"
                                size="medium"
                                value={oldPassword}
                                disabled={!enableEdit}
                                error={!!oldPasswordErrorFlag}
                                placeholder="Enter your current password..."
                                sx={{ width: "100%", display: enableEdit ? "flex" : "none" }}
                                aria-describedby="old-password-error-text"
                                onChange={(event) => setOldPassword(event.target.value)}
                                onBlur={validateOldPassword}
                            />
                        </FormControl>
                        <FormHelperText style={{ color: "#e15141" }} id="old-password-error-text">{oldPasswordError}</FormHelperText>
                        <FormControl style={{ display: "flex", marginTop: enableEdit ? "30px" : 0 }}>
                            <TextField
                                label="New Password"
                                size="medium"
                                type="password"
                                value={newPassword}
                                disabled={!enableEdit}
                                error={!!newPasswordErrorFlag}
                                placeholder="Enter your new password..."
                                sx={{ width: "100%", display: enableEdit ? "flex" : "none" }}
                                aria-describedby="new-password-error-text"
                                onChange={(event) => setNewPassword(event.target.value)}
                                onBlur={validateNewPassword}
                            />
                        </FormControl>
                        <FormHelperText style={{ color: "#e15141" }} id="new-password-error-text">{newPasswordError}</FormHelperText>
                        <Typography variant="subtitle1" sx={{ marginTop: "30px", display: enableEdit ? "block" : "none" }}>Click image to select new picture:</Typography>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: enableEdit ? 0 : "30px" }}>
                            <Avatar
                                src={profileImage ? URL.createObjectURL(profileImage) : defaultImage}
                                style={{ objectFit: "cover", width: "300px", height: "300px", borderRadius: "50%" }}
                                onClick={() => fileInputRef.current?.click()}
                            />
                            <input
                                disabled={!enableEdit}
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
                        {profileImage &&
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "10px" }}>
                                <Button
                                    size="large"
                                    color="error"
                                    variant="contained"
                                    onClick={handleDeleteProfileImage}
                                    sx={{
                                        width: "40%",
                                        display: enableEdit && hasImage ? "flex" : "none",
                                    }}
                                >Delete Profile Image</Button>
                            </div>
                        }
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "30px" }}>
                            <Button
                                size="large"
                                color={enableEdit ? "error" : "primary"}
                                disableRipple
                                variant="contained"
                                sx={{ width: "40%", marginRight: enableEdit ? "5px" : 0 }}
                                onClick={() => setEnableEdit(!enableEdit)}
                            >{enableEdit ? "Cancel" : "Edit"}</Button>
                            <Button
                                size="large"
                                variant="contained"
                                color="success"
                                disableRipple
                                disabled={firstNameErrorFlag || lastNameErrorFlag || emailErrorFlag || newPasswordErrorFlag || oldPasswordErrorFlag || oldPassword === ""}
                                sx={{
                                    width: "40%",
                                    display: enableEdit ? "block" : "none",
                                    marginLeft: "5px"
                                }}
                                onClick={handleEditProfile}>
                                Submit</Button>
                        </div>
                    </Paper>
                </div>
            }
        </div>
    )
}

export default Profile;
