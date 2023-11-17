import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Box, Typography, TextField, Button, Link } from '@mui/material';
import { customTextField } from '../styles/CustomTextField';
import { useNavigate } from 'react-router-dom';
import { ModeStorage } from '../hooks/ModeHook';
import { postToken } from '../utils/ApiService';
import { initialAccountDocument } from '../utils/Firebase';

export const SignIn = () => {
    const [message, setMessage] = useState('');
    const [cookies, setCookie] = useCookies(['access_token', 'refresh_token', 'token_type', 'id', 'password']);
    const navigate = useNavigate();
    const modeStorage = new ModeStorage();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        // QRコード用
        setCookie('id', formData.get('id'));
        setCookie('password', formData.get('password'));

        try {
            const data = await postToken(formData.get('id'), formData.get('password'));

            await initialAccountDocument(formData.get('id'), data.access_token);

            setCookie('access_token', data.access_token);
            setCookie('refresh_token', data.refresh_token);
            setMessage('Login successful!');
            navigate('/home');
        } catch (error) {
            setMessage('Login failed. Please check your credentials.');
            console.error('Login failed:', error);
        }
    };

    return (
        <>
            <Typography component="h1" variant="h5">
                サインイン
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    
                    margin="normal"
                    required
                    fullWidth
                    id="id"
                    label="ID"
                    name="id"
                    autoComplete="id"
                    autoFocus
                    sx={customTextField}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    sx={customTextField}
                />
                <Button
                    className="Button_white"
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    サインイン
                </Button>
                {message && <p>{message}</p>}
                {modeStorage.isDjMode()
                    ? <Link href="/signUp" variant="body2">
                        {"アカウントを持っていませんか？ サインアップ"}
                    </Link>
                    : null}
            </Box>
        </>
    );
}