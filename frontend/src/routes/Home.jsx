import { Box, Typography, TextField, ImageList, ImageListItem, Button } from '@mui/material';
import { Outlet, useNavigate } from "react-router-dom";
import { PlayingSong } from '../components/PlayingSong';
import { SongWaitList } from '../components/SongWaitList';
import { PageTitle } from '../components/PageTitle';

export const Home = ({ images }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <PageTitle title={'Reserve Songs'} />

      { /* 楽曲検索などのテキストフィールド */}
      <TextField id="search-song" label="Search by song title" variant="outlined" />
      <TextField id="search-artist" label="Search by artist" variant="outlined" />

      { /* 横並べで曲の画像を配置 */}
      <ImageList sx={{ overflowX: 'auto' }} rowHeight={200}>
        <ImageListItem sx={{ display: 'flex', flexDirection: 'row' }}>
          {images.map(image => {
            console.log(image);
            return (
              <img
                src={"./images/" + image}
                alt="title"
                loading='lazy'
                style={{ paddingRight: '1em' }}
              />
            )
          })}
        </ImageListItem>
      </ImageList>
      <Typography component="h2" variant="div">
        Song List
      </Typography>

      <Box sx={{ width: "100%", height: 2, bgcolor: 'black' }} />
      <PlayingSong imgPath={images[0]} />

      { /* リストで待機している曲の情報 */}
      <Box sx={{ width: "100%", height: 2, bgcolor: 'black' }} />
      <SongWaitList images={images} />
      <Box sx={{ width: "100%", height: 2, bgcolor: 'black' }} />

      <Button variant="contained" onClick={() => navigate('/edit')}>リストを編集する</Button>
    </Box>
  );
}