import React from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Box, Modal, TextField, Button, Typography } from '@mui/material';
import { customTextField } from '../styles/CustomTextField';
import { backendUrl } from '../config/backendUrl';
import { withAuthHeader } from '../config/Headers';

export const RegisterModalDialog = ({ open, setOpen }) => {
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

    return (
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
                        className='Button_white dark'
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                    >
                        登録
                    </Button>

                </Box>
                <Button
                    className='Button_white dark'
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
    );
}