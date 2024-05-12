import React from "react";
import axios from "axios";
import CSS from "csstype";
import PetitionsObject from "./PetitionsObject";
import {Paper, AlertTitle, Alert, FormControl, InputAdornment, Input, ToggleButtonGroup, ToggleButton, InputLabel } from "@mui/material";
import {Unstable_NumberInput as NumberInput} from "@mui/base";
import {Search} from "@mui/icons-material";

const Petitions = () => {
    const [petitions, setPetitions] = React.useState<Array<Petition>>([])
    const [filteredPetitions, setFilteredPetitions] = React.useState<Array<Petition>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [searchQuery, setSearchQuery] = React.useState("")
    const [selectedCategories, setSelectedCategories] = React.useState<Array<string>>([])
    const [maxSupportingCost, setMaxSupportingCost] = React.useState(Number("NaN"))

    const getPetitions = () => {
        axios.get("http://localhost:4941/api/v1/petitions")
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
    }, [setPetitions])

    React.useEffect(() => {
        let filtered = petitions.filter((petition) => 
            petition.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (selectedCategories.length > 0) {
            filtered = filtered.filter((petition) => 
                selectedCategories.includes(petition.categoryId.toString())
            );
        }
        if (!isNaN(Number(maxSupportingCost))) {
            filtered = filtered.filter((petition) =>
                petition.supportingCost <= maxSupportingCost);
        }

        setFilteredPetitions(filtered);
    }, [searchQuery, selectedCategories, maxSupportingCost, petitions]);

    const petition_rows = () => filteredPetitions.map((petition: Petition) => 
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

    return (
        <Paper elevation={3} style={card} >
            <h1>Petition List</h1>
            <div id="search-items" >
                <Input
                    id="search-bar"
                    placeholder="Search"
                    onChange={(val) => setSearchQuery(val.target.value)}
                    startAdornment={
                        <InputAdornment position="start">
                            <Search /> 
                        </InputAdornment>
                    }
                />
                <div style={{display: "flex", justifyContent: "center"}}>
                    <p style={{marginLeft: "10px", marginRight: "10px"}}>Supporting Cost &lt;= </p>
                    <Input 
                        placeholder="Type a number..."
                        type="number"
                        onChange={handleMaxSupportingCostChange}
                    />
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
        </Paper>
    )
}

export default Petitions;
