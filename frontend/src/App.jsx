import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import { backendUrl } from './config/backendUrl';
import { Setting } from './routes/Setting';
import { useCookies } from 'react-cookie';

const App = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['access_token']);

  var musicInfo = {};
  useEffect(() => {
    const header = {
      headers: {
        "Authorization": "Bearer " + cookies.access_token
      }
    }
    // バックエンドから曲のリストを取得する
    try {
      musicInfo = async () => {
        return await axios.get(backendUrl + '/music/get_queue_info', header);
      }
      console.log(musicInfo);
    } catch (error) {
      console.log(error);
    }
  }, []);

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
          <Route path="/home" element={<Home musicInfo={musicInfo} />} />
          <Route path="/edit" element={<ListEdit musicInfo={musicInfo} />} />
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