import React, { useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import { Container, Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import { Home } from "./routes/Home"
import { ListEdit } from './routes/ListEdit';
import { Search } from './routes/Search';
import { SignIn } from './routes/SignIn';
import { Dictaphone } from './components/Dictaphone';
import { SignUp } from './routes/SignUp';
import { EnqueueTextField } from './components/EnqueueTextField';
import { Setting } from './routes/Setting';

const App = () => {
  const navigate = useNavigate();
  const [state, setState] = useState(['Alan_Walker-Sing_me_to_sleep.png', 'Alan_Walker-Darkside.png', 'BUMP_OF_CHICKEN-ray.png', 'Mrs._GREEN_APPLE-Magic.png']);

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
          <IconButton color="common.white" onClick={() => { navigate("/home") }}>
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" sx={{ mr: "7em" }}>
            ふっきん牛乳
          </Typography>
          <IconButton color="common.white" onClick={() => { navigate("/setting") }}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        { /* ふっきん牛乳のイラスト */}
        <img src="./images/HukkinMilk.png" className="App-logo" alt="logo" />

        { /* React Router */}
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/home" element={<Home images={state} />} />
          <Route path="/edit" element={<ListEdit images={state} />} />
          <Route path="/search" element={<Search />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/enqueue" element={<EnqueueTextField />} />
        </Routes>

        { /* 音声認識はバックグラウンドで動作 */}
        <Dictaphone />
      </Box>
    </Container>
  );
};

export default App;