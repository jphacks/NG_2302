import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { TextField } from '@mui/material';
import { customTextField } from '../styles/CustomTextField';
import { backendUrl } from '../config/backendUrl';
import { withAuthHeader } from '../config/Headers';

export const TitleSearchTextField = ({ setTrackList }) => {
    const navigate = useNavigate();
    const [cookies] = useCookies(['access_token']);

    const searchMusicTrack = (title) => {
        const json = {
            music_title: title
        }
        try {
            axios.post(
                `${backendUrl}/music/search_music_by_title`,
                json,
                withAuthHeader(cookies.access_token),
            ).then(response => {
                const data = response.data;
                console.log(data);
                const trackList = [
                    {
                        id: data.first_music_track_id,
                        title: data.first_music_title,
                        artist: data.first_music_artist_name,
                        image_url: data.first_music_image_url
                    },
                    {
                        id: data.second_music_track_id,
                        title: data.second_music_title,
                        artist: data.second_music_artist_name,
                        image_url: data.second_music_image_url
                    },
                    {
                        id: data.third_music_track_id,
                        title: data.third_music_title,
                        artist: data.third_music_artist_name,
                        image_url: data.third_music_image_url
                    },
                    {
                        id: data.forth_music_track_id,
                        title: data.forth_music_title,
                        artist: data.forth_music_artist_name,
                        image_url: data.forth_music_image_url
                    },
                    {
                        id: data.fifth_music_track_id,
                        title: data.fifth_music_title,
                        artist: data.fifth_music_artist_name,
                        image_url: data.fifth_music_image_url
                    }
                ];
                console.log(trackList);
                setTrackList(trackList);
                navigate('/search_music');
            });
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <TextField
            id='search_title'
            sx={customTextField}
            label='タイトル検索'
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    const title = event.target.value;
                    console.log(title);
                    searchMusicTrack(title);
                }
            }}
        />
    )
}