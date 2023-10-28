import { Box, TextField, ImageList, ImageListItem, Button, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { PlayingSong } from '../components/PlayingSong';
import { SongWaitList } from '../components/SongWaitList';
import { PageTitle } from '../components/PageTitle';
import { CustomDivider } from '../components/CustomDivider';

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
      <TextField id="search-song" label="Search by song title" />
      <TextField id="search-artist" label="Search by artist" />

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

      <PageTitle title={'Song List'} />

      <PlayingSong imgPath={images[0]} />

      { /* リストで待機している曲の情報 */}
      <CustomDivider />
      <SongWaitList images={images} />
      <CustomDivider />

      <Button variant="contained" color="tertiary" onClick={() => navigate('/edit')}>
        <Typography color="common.white">
          リストを編集する
        </Typography>
      </Button>
    </Box>
  );
}