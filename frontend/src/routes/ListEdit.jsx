import { Box, TextField, ImageList, ImageListItem, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PlayingSong } from '../components/PlayingSong';
import { SongWaitList } from '../components/SongWaitList';
import { PageTitle } from '../components/PageTitle';
import { CustomDivider } from '../components/CustomDivider';
import { customTextField } from '../styles/CustomTextField';

export const ListEdit = ({ images }) => {
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

			<PlayingSong imgPath={images[0]} />

			{ /* リストで待機している曲の情報 */}
			<CustomDivider />
			<SongWaitList images={images} />
			<CustomDivider />

			<Button variant="contained" color="tertiary" onClick={() => navigate('/home')}>
				編集を終わる
			</Button>
		</Box>
	)
}
