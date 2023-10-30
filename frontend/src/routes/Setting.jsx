import { useState } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { PageTitle } from '../components/PageTitle';
import { customTextField } from '../styles/CustomTextField';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { backendUrl } from '../config/backendUrl';
import { QRCodeCanvas } from 'qrcode.react';

export const Setting = () => {
    const [cookies] = useCookies(['access_token', 'id', 'password']);
    const [qrCode, setQrCode] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const json = {
            spotify_client_id: data.get('client_id'),
            spotify_client_secret: data.get('client_secret'),
        };
        const header = {
            headers: {
                "Authorization": "Bearer " + cookies.access_token
            }
        }

        try {
            await axios.post(backendUrl + '/spotify/register', json, header);
        } catch (error) {
            console.log(error);
        }
    }

    const createQrCode = () => {
        console.log('createQrCode');
        const jsonData = {
            id: 'test',
            password: 'test',
        }
        /*
        const jsonData = {
            id: cookies.id,
            password: cookies.password,
        }
        */
        const jsonDataString = JSON.stringify(jsonData);
        var baseUrl = window.location.origin + '/qrAuth';
        
        // テスト用
        baseUrl = 'https://deploy-preview-22--loquacious-marigold-435f89.netlify.app';
        //return baseUrl + '/qrAuth?data=' + encodeURIComponent(jsonDataString);
        console.log(baseUrl + '/qrAuth/?data=' + encodeURIComponent(jsonDataString));
        setQrCode(baseUrl + '/qrAuth/?data=' + encodeURIComponent(jsonDataString));
    }

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                width: '100%', // これすると横がフルで表示される
            }}
        >
            <PageTitle title={'Settings'} />

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                    sx={{ mt: 3, mb: 2 }}
                >
                    登録
                </Button>
            </Box>

            <PageTitle title={'ゲストはこちら'} />
            <Button sx={{ mt: 2, mb: 2 }} onClick={createQrCode}>QRコード生成</Button>
            {
                qrCode !== '' &&
                <Grid container justifyContent="center">
                    <QRCodeCanvas
                        value={qrCode}
                        size={256}
                    />
                </Grid>
            }
        </Box>
    );
}