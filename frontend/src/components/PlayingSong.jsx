import {Typography, Box} from '@mui/material';

export const PlayingSong = ({imgUrl, title, artist}) => {
    return (
        <Box
            sx={{
                mt: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            { /* 現在流れている曲の情報　*/}
            <img src={imgUrl} className="Now-play-song" alt="jacket" width="300"/>
            <Box flexDirection={'row'} >
            <Typography component="body1">
                {title}
            </Typography>
            <Typography component="body1" style={{color: "#fffffe"}}>
                {"  /  " + artist}
            </Typography>
            </Box>
        </Box>
    )
}
