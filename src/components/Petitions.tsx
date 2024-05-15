import React from "react";
import axios from "axios";
import CSS from "csstype";
import PetitionsObject from "./PetitionsObject";
import {Paper, AlertTitle, Alert, MenuItem, Select, SelectChangeEvent, InputAdornment, Input, ToggleButtonGroup, ToggleButton, Pagination, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from "@mui/material";
import {Search} from "@mui/icons-material";
import BASE_URL from '../config';
import Navbar from './Navbar';

const Petitions = () => {
    const [petitions, setPetitions] = React.useState<Array<Petition>>([])
    const [filteredPetitions, setFilteredPetitions] = React.useState<Array<Petition>>([])
    const [paginatedPetitions, setPaginatedPetitions] = React.useState<Array<Petition>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [searchQuery, setSearchQuery] = React.useState("")
    const [selectedCategories, setSelectedCategories] = React.useState<Array<string>>([])
    const [maxSupportingCost, setMaxSupportingCost] = React.useState(NaN)
    const [sortType, setSortType] = React.useState("CREATED_ASC")
    const [pageSize, setPageSize] = React.useState(10)
    const [pageNumber, setPageNumber] = React.useState(1)
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false) 
    const [dialogPetition, setDialogPetition] = React.useState<Petition | null>(null)
    const [numberInputValue, setNumberInputValue] = React.useState("")

    const getPetitions = () => {
        axios.get(BASE_URL + "/petitions", {
            params: {
                sortBy: sortType
            }
        })
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setPetitions(response.data.petitions)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    React.useEffect(() => {
        getPetitions()
    }, [setPetitions, sortType])

    React.useEffect(() => {
        // Search query
        let filtered = petitions.filter((petition) => 
            petition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (petition.description && petition.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        // Categories
        if (selectedCategories.length > 0) {
            filtered = filtered.filter((petition) => 
                selectedCategories.includes(petition.categoryId.toString())
            );
        }

        // Max supporting cost
        if (!isNaN(Number(maxSupportingCost))) {
            filtered = filtered.filter((petition) =>
                petition.supportingCost <= maxSupportingCost);
        }

        setFilteredPetitions(filtered);

        // Page number and size
        setPaginatedPetitions(filtered.slice(pageSize * (pageNumber - 1), pageSize * pageNumber));

    }, [searchQuery, selectedCategories, maxSupportingCost, petitions, pageSize, pageNumber]);

    const petition_rows = () => paginatedPetitions.map((petition: Petition) =>
        <PetitionsObject key={petition.petitionId} petition={petition} />
    )

    const paperStyle: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "grid",
        width: "fill"
    }

    const handleCategorySelection = (
        event: React.MouseEvent<HTMLElement>,
        selected: string[],
    ) => {
        setSelectedCategories(selected);
    };

    const handleMaxSupportingCostChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const value = event.target.value;
        if (value === '' || /^[0-9]+$/.test(value)) {
            setNumberInputValue(value);
            setMaxSupportingCost(Number(value));
        }
        if (value === "") {
            setMaxSupportingCost(NaN);
        }
    };

    const handleSortTypeChange = (event: SelectChangeEvent) => {
        setSortType(event.target.value);
    };

    const handleDeleteDialogOpen = (petition: Petition) => {
        setOpenDeleteDialog(true);
        setDialogPetition(petition);
    }

    const handleDeleteDialogClose = () => {
        setDialogPetition(null);
        setOpenDeleteDialog(false);
    }

    const deletePetition = (petition: Petition) => {
        // Check that the petition does not have any supporters

    }

    const handlePageSizeChange = (event: any) => {
        setPageSize(event.target.value as number);
        setPageNumber(1);
    }

    return (
        <div>
            <div>
                <Navbar />
            </div>
            <Paper elevation={3} style={paperStyle} >
                <h1>Petition List</h1>
                <div id="search-items" >
                    <Input
                        id="search-bar"
                        placeholder="Search"
                        onChange={(event) => setSearchQuery(event.target.value)}
                        startAdornment={
                            <InputAdornment position="start">
                                <Search /> 
                            </InputAdornment>
                        }
                    />
                    <div style={{display: "flex", justifyContent: "center", marginTop: "20px"}}>
                        <p style={{marginLeft: "10px", marginRight: "10px"}}>Supporting Cost &lt;= </p>
                        <Input
                            size="small"
                            value={numberInputValue}
                            placeholder="Type a number..."
                            onChange={handleMaxSupportingCostChange}
                        />
                        <p style={{marginLeft: "10px", marginRight: "10px"}}>Sort By: </p>
                        <Select 
                            size="small"
                            value={sortType}
                            onChange={handleSortTypeChange}
                        >
                            <MenuItem value={"CREATED_ASC"}>Latest Date Created</MenuItem>
                            <MenuItem value={"CREATED_DESC"}>Earliest Date Created</MenuItem>
                            <MenuItem value={"ALPHABETICAL_ASC"}>Title A-Z</MenuItem>
                            <MenuItem value={"ALPHABETICAL_DESC"}>Title Z-A</MenuItem>
                            <MenuItem value={"COST_ASC"}>Lowest Cost</MenuItem>
                            <MenuItem value={"COST_DESC"}>Highest Cost</MenuItem>
                        </Select>
                    </div>
                    <ToggleButtonGroup size="small"
                        onChange={handleCategorySelection}
                        color="primary"
                        value={selectedCategories}
                        style={{margin:"10px"}}
                    >
                        <ToggleButton value="1">Wildlife</ToggleButton>
                        <ToggleButton value="2">Environmental Causes</ToggleButton>
                        <ToggleButton value="3">Animal Rights</ToggleButton>
                        <ToggleButton value="4">Education</ToggleButton>
                        <ToggleButton value="5">Human Rights</ToggleButton>
                        <ToggleButton value="6">Technology and Innovation</ToggleButton>
                        <ToggleButton value="7">Arts and Culture</ToggleButton>
                        <ToggleButton value="8">Community Development</ToggleButton>
                        <ToggleButton value="9">Economic Empowerment</ToggleButton>
                        <ToggleButton value="10">Science and Research</ToggleButton>
                        <ToggleButton value="11">Sports and Recreation</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <div style={{ display: "inline-block",  minWidth: "320px" }}>
                    {errorFlag?
                        <Alert severity = "error">
                            <AlertTitle>Error</AlertTitle>
                            { errorMessage }
                        </Alert>: ""}
                    { petition_rows() }
                </div>
                {pageNumber === Math.ceil(filteredPetitions.length / pageSize) && (
                    <p style={{color:"grey"}}>There are no more petitions</p>
                )}
                <div>
                    <div style={{display: "flex", justifyContent: "center", marginTop: "10px"}}>
                        <p style={{marginRight: "10px"}}>Petitions per page: </p>
                        <Select 
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            size="small"
                        >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={7}>7</MenuItem>
                            <MenuItem value={8}>8</MenuItem>
                            <MenuItem value={9}>9</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                        </Select>
                    </div>
                    <Pagination 
                        page={pageNumber}
                        showFirstButton
                        showLastButton
                        onChange={(event, value) => setPageNumber(value)}
                        style={{display: "flex", justifyContent: "center", marginTop: "10px"}}
                        count={Math.ceil(filteredPetitions.length / pageSize)} />
                </div>
            </Paper>
            <Dialog
                open={openDeleteDialog}
                onClose={handleDeleteDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{textAlign:"center"}}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete Petition"}
                </DialogTitle>
                    {dialogPetition && (
                        <DialogContent
                            style={{ display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                paddingBottom:"0"}}
                        >
                            <DialogContentText
                                id="alert-dialog-description"
                                style={{paddingTop:"10px"}}>
                                Are you sure you want to delete this petition?
                            </DialogContentText>
                            <DialogActions style={{
                                justifyContent:"center",
                                height:"100%",
                                paddingTop:"40px"
                            }}>
                                <Button
                                    style={{width:"100%", height:"50px"}}
                                    variant="outlined"
                                    onClick={handleDeleteDialogClose}>
                                    Cancel
                                </Button>
                                <Button
                                    style={{ width:"100%", height:"50px"}}
                                    variant="contained"
                                    color="error"
                                    disableElevation
                                    onClick={() => deletePetition(dialogPetition)}>
                                    Delete
                                </Button>
                            </DialogActions>
                        </DialogContent>
                    )}
                <DialogContent>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Petitions;
