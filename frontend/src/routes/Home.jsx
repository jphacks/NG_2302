import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { PlayingSong } from '../components/PlayingSong';
import { SongWaitList } from '../components/SongWaitList';
import { PageTitle } from '../components/PageTitle';
import { CustomDivider } from '../components/CustomDivider';
import { VolumeMeter } from '../components/VolumeMeter';
import { Dictaphone } from '../components/Dictaphone';
import { ModeTypes } from '../config/ModeTypes';
import { RegisterModalDialog } from '../components/RegisterModalDialog';
import { TitleSearchTextField } from '../components/TitleSearchTextField';
import { ArtistSearchTextField } from '../components/ArtistSearchTextField';
import { ModeStorage } from '../hooks/ModeHook';
import { Button } from '@mui/material';
import { getQueueInfo } from '../utils/ApiService';
import { registerUserAccount, setOnSnapshot } from '../utils/Firebase';

export const Home = ({ setTrackList }) => {
    const [open, setOpen] = useState(false);
    const [musicInfo, setMusicInfo] = useState({});
    const modeStorage = new ModeStorage();
    const [cookies, setCookie] = useCookies(['access_token', 'id', 'client_id']);
    const [elapsedTime, setElapsedTime] = useState(0); //経過時間を格納するためのState
    const updateTime = 3; // updateTimeを変更することで、Timerの更新頻度を変更できる
    let duration = -1;

    // バックエンドから曲のリストを取得する
    const getMusicInfo = async () => {
        try {
            const data = await getQueueInfo(cookies.access_token);
            duration = data.current_music_duration;
            setMusicInfo(data);
            console.log(musicInfo);
        } catch (error) { }
    }

    // 初期化時に実行
    useEffect(() => {
        const initLoad = async () => {
            if (cookies.client_id === undefined) {
                const clientId = await registerUserAccount(cookies.id);
                console.log(clientId);
                if (modeStorage.mode === ModeTypes.DJ) {
                    if (clientId === 'undefined') {
                        setOpen(true);
                    } else {
                        setCookie('client_id', clientId);
                        getMusicInfo();
                    }
                }
            } else {
                setOpen(false);
                setOnSnapshot(cookies.client_id, cookies.access_token, setMusicInfo);
                getMusicInfo();
            }
        }
        initLoad();

        const timer = setInterval(() => {
            setElapsedTime(prevTime => {
                // durationを超えたら再実行
                // 曲の残り時間を超えたところで、リロードする
                if (duration !== -1 && prevTime >= duration) {
                    // musicInfoをリセットする
                    getMusicInfo();
                    // 経過時間リセット
                    return 0;
                }
                // updateTime秒インクリメント
                return prevTime + updateTime;
            });
        }, updateTime * 1000); // updateTime秒 * 1000 = msごと

        return () => clearInterval(timer);
    }, []);

    // トークンが登録されたら、曲のリストを取得する
    useEffect(() => {
        if (cookies.client_id !== undefined) {
            getMusicInfo();
        }
    }, [cookies.client_id]);

    return (
        <>
            <RegisterModalDialog open={open} setOpen={setOpen} />

            <PageTitle title={'楽曲を追加する'} />

            <TitleSearchTextField setTrackList={setTrackList} />
            <ArtistSearchTextField setTrackList={setTrackList} />

            <PageTitle title={'楽曲リスト'} />

            <PlayingSong
                imgUrl={musicInfo.current_music_image_url}
                title={musicInfo.current_music_title}
                artist={musicInfo.current_music_artist_name} />

            { /* リストで待機している曲の情報 */}
            <CustomDivider />
            <SongWaitList musicInfo={musicInfo} />
            <CustomDivider />

            <Button
                className='Button_white dark'
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                onClick={() => getMusicInfo()}
            >
                更新
            </Button>

            {modeStorage.isDjMode()
                ? <>
                    { /* 音声認識はバックグラウンドで動作 */}
                    <Dictaphone />
                    { /* 音量表示これも本来バックグラウンドで動作 */}
                    <VolumeMeter />
                </>
                : null}
        </>
    );
}