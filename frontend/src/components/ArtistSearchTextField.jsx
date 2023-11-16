import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { TextField } from '@mui/material';
import { customTextField } from '../styles/CustomTextField';
import { backendUrl } from '../config/backendUrl';
import { withAuthHeader } from '../config/Headers';
import { convertTrackListJson } from '../utils/ConvertTrackListJson';

export const ArtistSearchTextField = ({setTrackList, label='アーティスト検索', isNavigate=true}) => {
    const navigate = useNavigate();
    const [cookies] = useCookies(['access_token']);

    const searchArtistTrack = (artist) => {
        const body = {
            artist_name: artist
        }
        try {
            axios.post(
                `${backendUrl}/music/search_music_by_artist_name`,
                body,
                withAuthHeader(cookies.access_token),
            ).then(response => {
                const data = response.data;
                console.log(data);
                const trackList = convertTrackListJson(data);
                setTrackList(trackList);
                if (isNavigate) {
                    navigate('/search_artist');
                }
            });
        } catch (e) {
            console.log(e);
        }
    }
    
    return (
        <TextField
            id='search_artist'
            sx={customTextField}
            label={label}
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    searchArtistTrack(event.target.value);
                }
            }}
        />
    )
}