import {Box, List, ListItemText, ListItemButton, Typography} from "@mui/material";

export const SongWaitList = ({musicInfo}) => {
    // リストに入っている曲を選択した時
    function handleListItemClick(event) {
    }

    const musics = [
        {
            img: musicInfo.first_music_image_url,
            title: musicInfo.first_music_title,
            artist: musicInfo.first_music_artist_title
        },
        {
            img: musicInfo.second_music_image_url,
            title: musicInfo.second_music_title,
            artist: musicInfo.second_music_artist_title
        },
        {
            img: musicInfo.third_music_image_url,
            title: musicInfo.third_music_title,
            artist: musicInfo.third_music_artist_title
        }
    ]

    return (
        <List component="nav" aria-label="next songs list">
            {musics.map((music, index) => {
                return (
                    <ListItemButton
                        sx={{display: 'flex', flexDirection: 'row'}}
                        onClick={(event) => handleListItemClick(event)}
                    >
                        <Box sx={{p: 2}}>
                            <Typography variant="h6" component="div">
                                {index + 1}
                            </Typography>
                        </Box>
                        <img
                            src={music.img}
                            alt="title"
                            loading='lazy'
                            style={{paddingRight: '1em'}}
                            height="40"
                        />
                        <ListItemText
                            primary={music.title}
                            secondary={music.artist}
                            secondaryTypographyProps={{style: {color: '#fffffe'}}}
                        />
                    </ListItemButton>
                )
            })}
        </List>
    )
}