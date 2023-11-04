import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useContext } from 'react';
import { ModeTypes } from '../config/ModeTypes';
import { ModeContext } from '../contexts/ModeContexts';

export const ModeSelect = () => {
    const navigate = useNavigate();
    const { mode, setMode } = useContext(ModeContext);

    function handleSubmit(mode) {
        console.log(mode);
        setMode(mode);
        navigate('/signIn');
    }

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
                モードを選択してください
            </Typography>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={() => handleSubmit(ModeTypes.DJ)}
                sx={{ mt: 3, mb: 2 }}
            >
                DJモード
            </Button>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={() => handleSubmit(ModeTypes.USER)}
                sx={{ mt: 3, mb: 2 }}
            >
                ユーザーモード
            </Button>
        </Box>
    );
}