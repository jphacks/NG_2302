import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import { Container, Box } from '@mui/material';

import { Home } from "./routes/Home"
import { ListEdit } from './routes/ListEdit';
import { Search } from './routes/Search';
import { SignIn } from './routes/SignIn';
import { Dictaphone } from './routes/Dictaphone';

const App = () => {
  const [state, setState] = useState(['Alan_Walker-Sing_me_to_sleep.png', 'Alan_Walker-Darkside.png', 'BUMP_OF_CHICKEN-ray.png', 'Mrs._GREEN_APPLE-Magic.png']);

  return (
    <Container component="main" maxWidth="xs">
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
          <Route path="/home" element={<Home images={state} />} />
          <Route path="/edit" element={<ListEdit images={state} />} />
          <Route path='/search' element={<Search />} />
        </Routes>

        { /* 音声認識はバックグラウンドで動作 */}
        <Dictaphone />
      </Box>
    </Container>
  );
};

export default App;