import React from 'react';
import { useCookies } from 'react-cookie';
import { Box, Modal, TextField, Button, Typography } from '@mui/material';
import { customTextField } from '../styles/CustomTextField';
import { postRegister } from '../utils/ApiService';

export const RegisterModalDialog = ({ open, setOpen }) => {
    const [cookies] = useCookies(['access_token']);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            await postRegister(
                formData.get('client_id'),
                formData.get('client_secret'),
                cookies.access_token
            )
            setOpen(false);
        } catch (error) { }
    }

    return (
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{ p: 2, position: 'absolute', width: 300, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'common.black', boxShadow: 24, }}>
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