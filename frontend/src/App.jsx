import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Routes, Route, useNavigate } from "react-router-dom";
import { Container, Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import { Home } from "./routes/Home";
import { SignIn } from './routes/SignIn';
import { SignUp } from './routes/SignUp';
import { backendUrl } from './config/backendUrl';
import { Setting } from './routes/Setting';
import { QrAuth } from './routes/QrAuth';
import { withAuthHeader } from './config/Headers';
import { ModeSelect } from './routes/ModeSelect';

const App = () => {
    const navigate = useNavigate();
    const [cookies] = useCookies(['access_token']);
    const [musicInfo, setMusicInfo] = useState({});
    const [elapsedTime, setElapsedTime] = React.useState(0); //経過時間を格納するためのState
    const updateTime = 3; // updateTimeを変更することで、Timerの更新頻度を変更できる
    let duration = -1;

    // バックエンドから曲のリストを取得する
    const getMusicInfo = async () => {
        try {
            await axios.get(`${backendUrl}/music/get_queue_info`, withAuthHeader(cookies.access_token))
                .then((res) => {
                    duration = res.data.current_music_duration;
                    setMusicInfo(res.data);
                });
            console.log(musicInfo);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            // 10秒間隔で更新する
            setElapsedTime(prevTime => {
                // durationを超えたら再実行
                // 曲の残り時間を超えたところで、リロードする
                if (duration !== -1 && prevTime >= duration) {
                    // musicInfoをリセットする
                    getMusicInfo();
                    // 経過時間リセット
                    return 0;
                }
                // updateTime秒インクリメント
                return prevTime + updateTime;
            });
        }, updateTime * 1000); // updateTime秒 * 1000 = msごと

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (cookies.access_token !== undefined) {
            getMusicInfo();
        }
    }, [cookies.access_token]);

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
                    <IconButton color="common.white" onClick={() => {
                        navigate("/home")
                    }}>
                        <HomeIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" sx={{ mr: "7em" }}>
                        ふっきん牛乳
                    </Typography>
                    <IconButton color="common.white" onClick={() => {
                        navigate("/setting")
                    }}>
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

                { /* React Router */}
                <Routes>
                    <Route path="/" element={<ModeSelect />} />
                    <Route path="/signIn" element={<SignIn />} />
                    <Route path="/signUp" element={<SignUp />} />
                    <Route path="/home" element={<Home musicInfo={musicInfo} />} />
                    <Route path="/setting" element={<Setting />} />
                    <Route path="/qrAuth" element={<QrAuth />} />
                </Routes>
            </Box>
            <Box sx={{ height: 32 }} />
        </Container>
    );
};

export default App;