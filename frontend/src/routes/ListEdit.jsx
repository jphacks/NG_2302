import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PlayingSong } from '../components/PlayingSong';
import { SongWaitList } from '../components/SongWaitList';
import { PageTitle } from '../components/PageTitle';

export const ListEdit = ({ images }) => {
	const navigate = useNavigate();

	return (
		<div>
			<Box sx={{
				marginTop: 8,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
			>
				<PageTitle title={'Song List'} />

				<PlayingSong imgPath={images[0]} />

				{ /* リストで待機している曲の情報 */}
				<Box sx={{ width: "100%", height: 2, bgcolor: 'black' }} />
				<SongWaitList images={images} />
				<Box sx={{ width: "100%", height: 2, bgcolor: 'black' }} />

				<Button variant="contained" onClick={() => navigate('/')}>編集を終わる</Button>
			</Box>
		</div>
	)
}