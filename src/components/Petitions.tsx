import React from "react";
import axios from "axios";
import CSS from "csstype";
import PetitionsObject from "./PetitionsObject";
import {Paper, AlertTitle, Alert, MenuItem, Select, SelectChangeEvent, InputAdornment, Input, ToggleButtonGroup, ToggleButton, Pagination} from "@mui/material";
import {Search} from "@mui/icons-material";

const Petitions = () => {
    const [petitions, setPetitions] = React.useState<Array<Petition>>([])
    const [filteredPetitions, setFilteredPetitions] = React.useState<Array<Petition>>([])
    const [paginatedPetitions, setPaginatedPetitions] = React.useState<Array<Petition>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [searchQuery, setSearchQuery] = React.useState("")
    const [selectedCategories, setSelectedCategories] = React.useState<Array<string>>([])
    const [maxSupportingCost, setMaxSupportingCost] = React.useState(Number("NaN"))
    const [sortType, setSortType] = React.useState("CREATED_ASC")
    const [pageSize, setPageSize] = React.useState(10)
    const [pageNumber, setPageNumber] = React.useState(1)

    const getPetitions = () => {
        axios.get("http://localhost:4941/api/v1/petitions", {
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
            petition.description.toLowerCase().includes(searchQuery.toLowerCase())
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
        <PetitionsObject key={ petition.petitionId } petition={petition}/>)

    const card: CSS.Properties = {
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
        if (!isNaN(Number(value))) {
            setMaxSupportingCost(Number(value));
        }
    };

    const handleSortTypeChange = (event: SelectChangeEvent) => {
        setSortType(event.target.value);
    };

    return (
        <Paper elevation={3} style={card} >
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
                        placeholder="Type a number..."
                        type="number"
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
            <div>
                <div style={{display: "flex", justifyContent: "center", marginTop: "10px"}}>
                    <p style={{marginRight: "10px"}}>Petitions per page: </p>
                    <Select 
                        value={pageSize}
                        onChange={(event) => setPageSize(event.target.value as number)}
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
                    onChange={(event, value) => setPageNumber(value)}
                    style={{display: "flex", justifyContent: "center", marginTop: "10px"}}
                    count={Math.ceil(filteredPetitions.length / pageSize)} />
            </div>
        </Paper>
    )
}

export default Petitions;
