import {useState} from 'react';
import {useCookies} from 'react-cookie';
import {Box, Typography, TextField, Button, Link} from '@mui/material';
import {customTextField} from '../styles/CustomTextField';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {backendUrl} from '../config/backendUrl';
import {urlEncodedHeader} from '../config/Headers';

export const SignIn = () => {
    const [message, setMessage] = useState('');
    const [cookies, setCookie] = useCookies(['access_token', 'refresh_token', 'token_type', 'id', 'password']);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const json = {
            username: data.get('id'),
            password: data.get('password'),
        };

        // QRコード用
        setCookie('id', data.get('id'));
        setCookie('password', data.get('password'));

        try {
            const result = await axios.post(`${backendUrl}/auth/token`, json, urlEncodedHeader);
            if (result != null) {
                setCookie('access_token', result.data.access_token);
                setCookie('refresh_token', result.data.refresh_token);
                setMessage('Login successful!');
                navigate('/home');
            }
        } catch (error) {
            setMessage('Login failed. Please check your credentials.');
            console.error('Login failed:', error);
        }
    };

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5">
                サインイン
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
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
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                >
                    サインイン
                </Button>
                {message && <p>{message}</p>}
                <Link href="/signUp" variant="body2">
                    {"アカウントを持っていませんか？ サインアップ"}
                </Link>
            </Box>
        </Box>
    );
}