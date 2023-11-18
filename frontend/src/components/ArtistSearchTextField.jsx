import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { TextField } from '@mui/material';
import { customTextField } from '../styles/CustomTextField';
import { convertTrackListJson } from '../utils/ConvertTrackListJson';
import { postSearchArtistName } from '../utils/ApiService';

export const ArtistSearchTextField = ({ setTrackList, label = 'アーティスト検索', isNavigate = true }) => {
    const navigate = useNavigate();
    const [cookies] = useCookies(['access_token']);

    const searchArtistTrack = async (artist) => {
        try {
            const data = await postSearchArtistName(artist, cookies.access_token);
            console.log(data);
            const trackList = convertTrackListJson(data);
            setTrackList(trackList);
            if (isNavigate) {
                navigate('/search_artist');
            }
        } catch (error) { }
    }

    return (
        <TextField
            className='form'
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