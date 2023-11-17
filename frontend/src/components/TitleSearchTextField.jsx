import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { TextField } from '@mui/material';
import { customTextField } from '../styles/CustomTextField';
import { convertTrackListJson } from '../utils/ConvertTrackListJson';
import { postSearchMusicTitle } from '../utils/ApiService';

export const TitleSearchTextField = ({ setTrackList, label = 'タイトル検索', isNavigate = true }) => {
    const navigate = useNavigate();
    const [cookies] = useCookies(['access_token']);

    const searchMusicTrack = async (title) => {
        try {
            const data = await postSearchMusicTitle(title, cookies.access_token);
            console.log(data);
            const trackList = convertTrackListJson(data);
            setTrackList(trackList);
            if (isNavigate) {
                navigate('/search_music');
            }
        } catch (error) { }
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