import { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Box, Typography, TextField, Button, Link } from '@mui/material';
import { customTextField } from '../styles/CustomTextField';
import { useNavigate } from 'react-router-dom';

export const SignIn = () => {
	const [message, setMessage] = useState('');
	const navigate = useNavigate();
	const [cookies, setCookie] = useCookies(['access_token', 'refresh_token', 'token_type']);

	const header = {
		'Content-Type': 'application/x-www-form-urlencoded',
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const loginData = {
			username: data.get('id'),
			password: data.get('password'),
		};

		try {
			await axios.post('http://127.0.0.1:8000/auth/token', loginData, {headers: header})
				.then(res => {
					setCookie('access_token', res.data.access_token);
					setCookie('refresh_token', res.data.refresh_token);
				});
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
					type="submit"
					fullWidth
					variant="contained"
					sx={{ mt: 3, mb: 2 }}
					onClick={() => navigate('/home')}
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