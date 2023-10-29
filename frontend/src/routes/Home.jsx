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
import { backendUrl } from '../config/backendUrl';
import { useCookies } from 'react-cookie';

export const Home = ({ images }) => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['access_token']);

  var playingData = {};
  const getSongInfo = async () => {
    const header = {
      headers: {
        "Authorization": "Bearer " + cookies.access_token
      }
    }

    var response = {};
    try {
      response = await axios.get(backendUrl + '/music/get_music_info', header);
    } catch (error) {
      console.log(error);
    }

    return response.data;
  }

  useEffect(() => {
    playingData = getSongInfo();
  }, [])

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

      <PlayingSong imgUrl={playingData.image_url} title={playingData.title} artist={playingData.artist_name} />

      { /* リストで待機している曲の情報 */}
      <CustomDivider />
      <SongWaitList images={images} />
      <CustomDivider />

      <Button variant="contained" color="tertiary" onClick={() => navigate('/edit')}>
        リストを編集する
      </Button>
    </Box>
  );
}