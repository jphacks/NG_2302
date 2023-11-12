import React from 'react';
import { TextField } from '@mui/material';
import { customTextField } from '../styles/CustomTextField';

export const ArtistSearchTextField = ({ setArtistList }) => {
    return (
        <TextField
            id='search_title'
            sx={customTextField}
            label='アーティスト検索'
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    const title = event.target.value;
                    console.log(title);
                    searchArtist(title);
                }
            }}
        />
    )
}