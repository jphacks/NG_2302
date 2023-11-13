import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { ModeTypes } from '../config/ModeTypes';
import { useModeContext } from '../hooks/ModeHook';

export const ModeSelect = () => {
    const navigate = useNavigate();
    const {mode, setMode} = useModeContext();

    function handleSubmit(mode) {
        setMode(mode);
        console.log(mode);
        navigate('/signIn');
    }

    return (
        <>
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
        </>
    );
}