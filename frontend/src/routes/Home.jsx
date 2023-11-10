import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Box } from '@mui/material';
import { EnqueueTextField } from '../components/EnqueueTextField';
import { PlayingSong } from '../components/PlayingSong';
import { SongWaitList } from '../components/SongWaitList';
import { PageTitle } from '../components/PageTitle';
import { CustomDivider } from '../components/CustomDivider';
import { VolumeMeter } from '../components/VolumeMeter';
import { Dictaphone } from '../components/Dictaphone';
import { ModeTypes } from '../config/ModeTypes';
import { ModeContext } from '../App';
import { RegisterModalDialog } from '../components/RegisterModalDialog';
import { TitleSearchTextField } from '../components/TitleSearchTextField';

export const Home = ({ musicInfo, setTrackList }) => {
    const [open, setOpen] = useState(false);
    const { mode } = useContext(ModeContext);
    const [cookies] = useCookies(['access_token']);

    useEffect(() => {
        if (mode === ModeTypes.DJ && cookies.access_token === undefined) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, []);

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
            <RegisterModalDialog open={open} setOpen={setOpen} />

            <PageTitle title={'Reserve Songs'} />

            <EnqueueTextField />
            <TitleSearchTextField setTrackList={setTrackList} />

            <PageTitle title={'Song List'} />

            <PlayingSong
                imgUrl={musicInfo.current_music_image_url}
                title={musicInfo.current_music_title}
                artist={musicInfo.current_music_artist_name} />

            { /* リストで待機している曲の情報 */}
            <CustomDivider />
            <SongWaitList musicInfo={musicInfo} />
            <CustomDivider />

            { /* 音声認識はバックグラウンドで動作 */}
            <Dictaphone />
            { /* 音量表示これも本来バックグラウンドで動作 */}
            <VolumeMeter />
        </Box>
    );
}