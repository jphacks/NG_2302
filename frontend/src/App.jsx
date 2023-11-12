import React, { useState, createContext } from 'react';
import { Routes, Route, Outlet } from "react-router-dom";
import { Container, Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import { Home } from "./routes/Home";
import { SignIn } from './routes/SignIn';
import { SignUp } from './routes/SignUp';
import { Setting } from './routes/Setting';
import { QrAuth } from './routes/QrAuth';
import { ModeSelect } from './routes/ModeSelect';
import { SearchMusic } from './routes/SearchMusic';

export const ModeContext = createContext();

const Layout = () => {
    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
            }}
        >
            <Outlet />
        </Box>
    );
}

export default function App() {
    const [mode, setMode] = useState('');
    const [trackList, setTrackList] = useState([]);

    return (
        <Container component="main" maxWidth="xs">
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    position: 'relative',
                }}
            >
                <Toolbar>
                    <IconButton color="common.white" href='/home' >
                        <HomeIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" sx={{ mr: "7em" }}>
                        ふっきん牛乳
                    </Typography>
                    <IconButton color="common.white" href='/setting'>
                        <SettingsIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                { /* ふっきん牛乳のイラスト (qrAuthの時に相対パスだと表示されないので絶対パスを使用) */}
                <img src={window.location.origin + "/images/HukkinMilk.png"} className="App-logo" alt="logo" />

                <ModeContext.Provider value={{ mode, setMode }}>
                    { /* React Router */}
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/" element={<ModeSelect />} />
                            <Route path="/signIn" element={<SignIn />} />
                            <Route path="/signUp" element={<SignUp />} />
                            <Route path="/home" element={<Home setTrackList={setTrackList} />} />
                            <Route path="/setting" element={<Setting />} />
                            <Route path="/qrAuth" element={<QrAuth />} />
                            <Route path="/search_music" element={<SearchMusic trackList={trackList} />} />
                        </Route>
                    </Routes>
                </ModeContext.Provider>
            </Box>
            <Box sx={{ height: 32 }} />
        </Container>
    );
};