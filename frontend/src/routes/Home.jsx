import { EnqueueTextField } from '../components/EnqueueTextField';
import { Box } from '@mui/material';
import { PlayingSong } from '../components/PlayingSong';
import { SongWaitList } from '../components/SongWaitList';
import { PageTitle } from '../components/PageTitle';
import { CustomDivider } from '../components/CustomDivider';

export const Home = ({ musicInfo }) => {
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

      <PlayingSong
        imgUrl={musicInfo.current_music_image_url}
        title={musicInfo.current_music_title}
        artist={musicInfo.current_music_artist_name} />

      { /* リストで待機している曲の情報 */}
      <CustomDivider />
      <SongWaitList musicInfo={musicInfo} />
      <CustomDivider />

    </Box>
  );
}