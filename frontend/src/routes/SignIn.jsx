import { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, FormControlLabel, Grid, Checkbox, Link } from '@mui/material';
import { customTextField } from '../styles/CustomTextField';

export const SignIn = () => {

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginData = {
      username: data.get('id'),
      password: data.get('password'),
    };

    try {
      const response = await axios.post('http://localhost:8000/token', loginData);
      const token = response.data.access_token;
      console.log('Token:', token);
      setMessage('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
      setMessage('Login failed. Please check your credentials.');
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
        Sign in
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
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        <Link href="#" variant="body2">
          {"Don't have an account? Sign Up"}
        </Link>
      </Box>
    </Box>
  );
}