import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { TextField } from '@mui/material';
import { customTextField } from '../styles/CustomTextField';
import { backendUrl } from '../config/backendUrl';
import { withAuthHeader } from '../config/Headers';
import { convertTrackListJson } from '../utils/ConvertTrackListJson';

export const TitleSearchTextField = ({setTrackList, label='タイトル検索', isNavigate=true}) => {
    const navigate = useNavigate();
    const [cookies] = useCookies(['access_token']);

    const searchMusicTrack = (title) => {
        const body = {
            music_title: title
        }
        try {
            axios.post(
                `${backendUrl}/music/search_music_by_title`,
                body,
                withAuthHeader(cookies.access_token),
            ).then(response => {
                const data = response.data;
                console.log(data);
                const trackList = convertTrackListJson(data);
                setTrackList(trackList);
                if (isNavigate) {
                    navigate('/search_music');
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <TextField
            id='search_title'
            sx={customTextField}
            label={label}
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    searchMusicTrack(event.target.value);
                }
            }}
        />
    )
}