import { EnqueueTextField } from '../components/EnqueueTextField';
import { Box, TextField, ImageList, ImageListItem, Button } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { PlayingSong } from '../components/PlayingSong';
import { SongWaitList } from '../components/SongWaitList';
import { PageTitle } from '../components/PageTitle';
import { CustomDivider } from '../components/CustomDivider';
import { customTextField } from '../styles/CustomTextField';

export const Home = ({ musicInfo }) => {
  const navigate = useNavigate();

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
      <PageTitle title={'Reserve Songs'} />

      <EnqueueTextField />

      <PageTitle title={'Song List'} />

      <PlayingSong imgUrl={musicInfo.current_music_image_url} title={musicInfo.current_music_title} artist={musicInfo.current_music_artist_name} />

      { /* リストで待機している曲の情報 */}
      <CustomDivider />
      <SongWaitList musicInfo={musicInfo} />
      <CustomDivider />

      <Button variant="contained" color="tertiary" onClick={() => navigate('/edit')}>
        リストを編集する
      </Button>
    </Box>
  );
}