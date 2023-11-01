import {Typography, Box} from '@mui/material';

export const PlayingSong = ({imgUrl, title, artist}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            { /* 現在流れている曲の情報　*/}
            <Typography component="subtitle1">
                now
            </Typography>
            <img src={imgUrl} className="Now-play-song" alt="jacket" width="340"/>
            <Typography component="body1">
                {title}
            </Typography>
            <Typography component="body1" style={{color: "#fffffe"}}>
                {"/ " + artist}
            </Typography>
        </Box>
    )
}
