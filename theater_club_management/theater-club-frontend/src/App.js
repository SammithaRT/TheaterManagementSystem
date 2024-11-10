import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Members from './components/Members';
import Writers from './components/Writers';
import UserAccount from './components/UserAccount';
import Actors from './components/Actors';
import Producers from './components/Producers';
import HomeAccount from './components/HomeAccount';
import Play_Members from './components/Play_Members';
import Plays from './components/Plays';


import './App.css';

function App() {
    return (
        <Router>
            <div className="body">
                {/* <header className="App-header">
                    <h1>DRAMA-TRICKS</h1>
                </header> */}
                <div className="container">
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/members" element={<Members />} />
                        <Route path="/writers" element={<Writers />} />
                        <Route path="/account" element={<UserAccount />} />
                        <Route path="/actor" element={<Actors />} />
                        <Route path="/producers" element={<Producers />} />
                        <Route path="/homeacc" element={<HomeAccount />} />
                        <Route path="/:eventId/:playId/play_members" element={<Play_Members />} />
                        <Route path="/:eventId/plays" element={<Plays />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
