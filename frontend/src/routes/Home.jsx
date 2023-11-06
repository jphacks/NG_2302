import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Box, Modal, TextField, Button, Typography } from '@mui/material';
import { customTextField } from '../styles/CustomTextField';
import { EnqueueTextField } from '../components/EnqueueTextField';
import { PlayingSong } from '../components/PlayingSong';
import { SongWaitList } from '../components/SongWaitList';
import { PageTitle } from '../components/PageTitle';
import { CustomDivider } from '../components/CustomDivider';
import { VolumeMeter } from '../components/VolumeMeter';
import { Dictaphone } from '../components/Dictaphone';
import { backendUrl } from '../config/backendUrl';
import { withAuthHeader } from '../config/Headers';
import { ModeTypes } from '../config/ModeTypes';
import { ModeContext } from '../App';


export const Home = ({ musicInfo }) => {
    const [open, setOpen] = useState(true);
    const {mode, setMode} = useContext(ModeContext);
    const [cookies] = useCookies(['access_token']);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const json = {
            spotify_client_id: data.get('client_id'),
            spotify_client_secret: data.get('client_secret'),
        };
        const headers = withAuthHeader(cookies.access_token);
        try {
            await axios.post(`${backendUrl}/spotify/register`, json, headers)
                .then(res => {
                    console.log(res.data);
                    setOpen(false);
                });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (mode === ModeTypes.DJ && cookies.access_token === undefined) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, []);

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
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ p: 2, position: 'absolute', width: 400, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'common.black', boxShadow: 24, }}>
                    <Box component="form" onSubmit={handleSubmit} noValidate>

                        <Typography component="h3" variant="div">
                            Spotify Client ID
                        </Typography>
                        <TextField
                            id="client_id"
                            name='client_id'
                            fullWidth
                            sx={customTextField}
                        />

                        <Typography component="h3" variant="div">
                            Spotify Client Secret
                        </Typography>
                        <TextField
                            id='client_secret'
                            name='client_secret'
                            fullWidth
                            sx={customTextField}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3 }}
                        >
                            登録
                        </Button>

                    </Box>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 2 }}
                        onClick={() => setOpen(false)}
                    >
                        閉じる
                    </Button>
                </Box>

            </Modal>

            <PageTitle title={'Reserve Songs'} />

            <EnqueueTextField />

            <PageTitle title={'Song List'} />

            <PlayingSong
                imgUrl={musicInfo.current_music_image_url}
                title={musicInfo.current_music_title}
                artist={musicInfo.current_music_artist_name} />

            { /* リストで待機している曲の情報 */}
            <CustomDivider />
            <SongWaitList musicInfo={musicInfo} />
            <CustomDivider />

            { /* 音声認識はバックグラウンドで動作 */}
            <Dictaphone />
            { /* 音量表示これも本来バックグラウンドで動作 */}
            <VolumeMeter />
        </Box>
    );
}