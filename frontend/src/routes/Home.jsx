import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../config/backendUrl';
import { withAuthHeader } from '../config/Headers';
import { useCookies } from 'react-cookie';
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

export const Home = ({ setTrackList }) => {
    const [open, setOpen] = useState(false);
    const [musicInfo, setMusicInfo] = useState({});
    const { mode } = useContext(ModeContext);
    const [cookies] = useCookies(['access_token']);
    const [elapsedTime, setElapsedTime] = useState(0); //経過時間を格納するためのState
    const updateTime = 3; // updateTimeを変更することで、Timerの更新頻度を変更できる
    let duration = -1;

    // バックエンドから曲のリストを取得する
    const getMusicInfo = async () => {
        try {
            await axios.get(`${backendUrl}/music/get_queue_info`, withAuthHeader(cookies.access_token))
                .then((res) => {
                    duration = res.data.current_music_duration;
                    setMusicInfo(res.data);
                });
            console.log(musicInfo);
        } catch (error) {
            console.log(error);
        }
    }

    // 初期化時に実行
    useEffect(() => {
        if (mode === ModeTypes.DJ && cookies.access_token === undefined) {
            setOpen(true);
        } else {
            setOpen(false);
        }

        const timer = setInterval(() => {
            // 10秒間隔で更新する
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
        if (cookies.access_token !== undefined) {
            getMusicInfo();
        }
    }, [cookies.access_token]);

    return (
        <>
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
        </>
    );
}