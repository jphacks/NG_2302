import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Box, Typography, Card, CardActionArea, CardMedia, CardContent, Modal, Button } from '@mui/material';
import { PageTitle } from '../components/PageTitle';
import { TitleSearchTextField } from '../components/TitleSearchTextField';
import { ArtistSearchTextField } from '../components/ArtistSearchTextField';
import { postEnqueueTrackId } from '../utils/ApiService';

export const SearchedMusicList = ({ trackList, setTrackList, mode }) => {
    const [open, setOpen] = useState(false);
    const [cookies] = useCookies(['access_token', 'client_id']);
    const [clickedTrack, setClickedTrack] = useState({});

    // trackIdで楽曲をキューに追加する
    const addQueue = async (trackId) => {
        try {
            await postEnqueueTrackId(trackId, cookies.access_token, cookies.client_id);
            setOpen(false);
        } catch (error) { }
    }

    // 楽曲のカードを作成する
    const trackCard = (track) => {
        return (
            <Card sx={{ mt: 1, mb: 1, width: "80%", display: 'flex' }}>
                <CardActionArea
                    sx={{ display: 'flex' }}
                    onClick={() => {
                        setClickedTrack(track);
                        setOpen(true);
                    }}
                >
                    <CardMedia
                        component="img"
                        sx={{ width: 140 }}
                        image={track.image_url}
                        alt="track image"
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%" }}>
                        <CardContent>
                            <Typography component="div" color="text.secondary" variant="h5">
                                {track.title}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {track.artist}
                            </Typography>
                        </CardContent>
                    </Box>
                </CardActionArea>
            </Card>
        )
    }

    return (
        <>
            {/* 曲追加確認のダイアログ */}
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ p: 2, position: 'absolute', width: 300, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'common.black', boxShadow: 24, }}>
                    <Typography component="h2" variant="div">
                        この曲を追加しますか？
                    </Typography>
                    <Typography component="div" variant="h5" sx={{ mt: 2 }}>
                        {clickedTrack.title}
                    </Typography>
                    <Typography variant="subtitle1" component="div">
                        {clickedTrack.artist}
                    </Typography>
                    <Button
                        className='Button_white dark'
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                        onClick={() => addQueue(clickedTrack.id)}
                    >
                        はい
                    </Button>
                    <Button
                        className='Button_white dark'
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => setOpen(false)}
                    >
                        いいえ
                    </Button>
                </Box>
            </Modal>

            <PageTitle title={'タイトル検索'} />
            {mode === 'title'
                ? <TitleSearchTextField setTrackList={setTrackList} label='タイトル再検索' isNavigate={false} className='form' />
                : <ArtistSearchTextField setTrackList={setTrackList} label='アーティスト再検索' isNavigate={false} className='form' />
            }

            <Typography variant="h6" component="div" sx={{ mt: 2 }} >
                検索結果
            </Typography>

            {/* 検索結果をリスト表示 */}
            {trackList.map(track => trackCard(track))}
        </>
    )
}