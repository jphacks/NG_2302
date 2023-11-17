import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Box, Typography, TextField, Button, Link } from '@mui/material';
import { customTextField } from '../styles/CustomTextField';
import { useNavigate } from 'react-router-dom';
import { postAccount, postToken } from '../utils/ApiService';

export const SignUp = () => {
    const [message, setMessage] = useState('');
    const [cookies, setCookie] = useCookies(['access_token', 'refresh_token', 'id', 'password']);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const id = formData.get('id');
        const password = formData.get('password');

        // QRコード用
        setCookie('id', id);
        setCookie('password', password);

        try {
            await postAccount(id, password);
            setMessage('Account created successfully!');
        } catch (error) {
            setMessage('Account creation failed. Please try again.');
            console.error('Account creation failed:', error);
        }

        try {
            const data = await postToken(id, password);
            setCookie('access_token', data.access_token);
            setCookie('refresh_token', data.refresh_token);
            setMessage('Login successful!');
            navigate('/home');
        } catch (error) {
            setMessage('Login failed. Please try again.');
            console.error('Login failed:', error);
        }
    };

    return (
        <>
            <Typography component="h1" variant="h5">
                アカウントを作成
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
                    autoComplete="new-password"
                    sx={customTextField}
                />
                <Button
                    className='Button_white'
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    サインアップ
                </Button>
                {message && <p>{message}</p>}
                <Link href="/signIn" variant="body2">
                    {"すでにアカウントを持っていますか？ サインイン"}
                </Link>
            </Box>
        </>
    );
}
