import React from 'react';
import { Box, Typography, Card, CardActionArea, CardMedia, CardContent } from '@mui/material';
import { PageTitle } from '../components/PageTitle';

export const SearchMusic = ({ trackList }) => {
    const trackCard = (track) => {
        return (
            <Card sx={{ mt: 1, mb: 1, width: "80%", display: 'flex' }}>
                <CardActionArea sx={{display: 'flex', }}>
                    <CardMedia
                        component="img"
                        sx={{ width: 140 }}
                        image={track.image_url}
                        alt="track image"
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%" }}>
                        <CardContent>
                            <Typography component="div" color="text.secondary" variant="h5">
                                {track.title}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {track.artist}
                            </Typography>
                        </CardContent>
                    </Box>
                </CardActionArea>
            </Card>
        )
    }

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
            }}
        >
            <PageTitle title={'タイトル検索'} />

            <Typography variant="h6" component="div" >
                検索結果
            </Typography>

            {trackList.map(track => trackCard(track))}
        </Box>
    )
}