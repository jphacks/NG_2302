import { Box, TextField, ImageList, ImageListItem, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PlayingSong } from '../components/PlayingSong';
import { SongWaitList } from '../components/SongWaitList';
import { PageTitle } from '../components/PageTitle';
import { CustomDivider } from '../components/CustomDivider';

// 現在は使ってないが残す
export const ListEdit = ({ musicInfo }) => {
	const navigate = useNavigate();

	return (
		<Box sx={{
			marginTop: 8,
			display: 'flex',
			flexDirection: 'column',
			width: '100%',
			alignItems: 'center',
		}}>
			<PageTitle title={'Song List'} />

			<PlayingSong imgUrl={musicInfo.current_music_image_url} title={musicInfo.current_music_title} artist={musicInfo.current_music_artist_title} />

			{ /* リストで待機している曲の情報 */}
			<CustomDivider />
			<SongWaitList musicInfo={musicInfo} />
			<CustomDivider />

			<Button variant="contained" color="tertiary" onClick={() => navigate('/home')}>
				編集を終わる
			</Button>
		</Box>
	)
}
