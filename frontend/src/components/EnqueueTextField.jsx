import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Box, Button, TextField } from "@mui/material";
import { customTextField } from '../styles/CustomTextField';
import { backendUrl } from '../config/backendUrl';
import { withAuthHeader } from '../config/Headers';

export const EnqueueTextField = () => {
    const [cookies] = useCookies(['access_token']);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const fieldData = { music_title: data.get('title') };

        try {
            await axios.post(
                `${backendUrl}/music/enqueue`,
                fieldData, 
                withAuthHeader(cookies.access_token),
            ).then(res => {
                console.log(res.data);
                // 楽曲追加の際にページをリロードする
                window.location.reload();
            });
        } catch (error) {
            console.error('Enqueue failed:', error);
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
            <TextField id='title' name='title' label="曲名を入力" sx={customTextField} />
            <Button type="submit" variant="contained" color="tertiary" sx={{ ml: 2}}>
                追加
            </Button>
        </Box>
    );
}