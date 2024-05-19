import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Petitions from "./components/Petitions";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Petition from "./components/Petition";
import NotFound from "./components/NotFound";
import CreatePetition from "./components/CreatePetition";
import EditPetition from "./components/EditPetition";
import './globalStyles.css';

function App() {
    return (
        <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="/"                 element={<Petitions/>}/>
                        <Route path="/register"         element={<Register/>}/>
                        <Route path="/login"            element={<Login/>}/>
                        <Route path="/profile"          element={<Profile/>}/>
                        <Route path="/petitions/:id"    element={<Petition/>}/>
                        <Route path="/createPetition"   element={<CreatePetition/>}/>
                        <Route path="/editPetitions/:id" element={<EditPetition/>}/>
                        <Route path="*"                 element={<NotFound/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;
