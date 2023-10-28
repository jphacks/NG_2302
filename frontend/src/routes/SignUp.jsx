import { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, Link } from '@mui/material';
import { customTextField } from '../styles/CustomTextField';

export const SignUp = () => {
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const signupData = {
            login_id: data.get('id'),
            login_password: data.get('password'),
        };

        try {
            await axios.post('http://localhost:8000/account', signupData);
            setMessage('Account created successfully!');
        } catch (error) {
            console.error('Account creation failed:', error);
            setMessage('Account creation failed. Please try again.');
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
                Sign Up
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
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign Up
                </Button>
                {message && <p>{message}</p>}
                <Link href="#" variant="body2">
                    {"Already have an account? Sign In"}
                </Link>
            </Box>
        </Box>
    );
}
