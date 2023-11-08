import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Typography, Switch, Box } from "@mui/material";
import { backendUrl } from '../config/backendUrl';
import { withAuthHeader } from '../config/Headers';

const audioContext = new AudioContext();
var count = 0;
var volSum = 0;

export const VolumeMeter = () => {
    const [inProgress, setInProgress] = useState(false);
    const [checked, setChecked] = useState(false);
    const [volume, setVolume] = useState(0);
    const [cookies] = useCookies(['access_token']);
    //経過時間を格納するためのState
    const [elapsedTime, setElapsedTime] = useState(0);
    let intervalRef = useRef(null);

    /* 音量調整HTTP.POST and Timer */
    const postAdjustVolume = async (volume) => {
        const json = {
            volume_percent: volume,
        }

        try {
            await axios.post(
                `${backendUrl}/music/adjust_volume`,
                json,
                withAuthHeader(cookies.access_token)
            ).then(res => {
                console.log(res.data);
            });
        } catch (error) {
            console.error('Adjust volume failed:', error);
        }
    }

    function runTimerAction() {
        if (intervalRef.current !== null) return;

        intervalRef.current = setInterval(() => {
            // 1分間隔で音量を調節
            // wordCountに基づいて音量を決定する
            setElapsedTime(prevTime => {
                if (prevTime >= 20) {
                    //60秒経過時のロジック
                    postAdjustVolume(volSum / 200);

                    return 0; //経過時間リセット
                }
                return prevTime + 1; // 1秒インクリメント
            });
        }, 1000); // 1秒ごと
    }

    useEffect(() => {
        if (checked) {
            runTimerAction();
        }
    }, []);

    /* ボリュームメーターAPI */
    const onStart = async () => {
        if (inProgress) return;
        setInProgress(true);

        await audioContext.audioWorklet.addModule('VolumeProcessor.js');
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const micNode = audioContext.createMediaStreamSource(mediaStream);
        const volumeMeterNode = new AudioWorkletNode(audioContext, 'volume-meter');
        volumeMeterNode.port.onmessage = (event) => {
            console.log(event.data);
            const value = Math.round(event.data * 100000) / 100;
            count++;
            const average = Math.round((volSum + value)/count * 100) / 100
            setVolume(average);
        }
        micNode.connect(volumeMeterNode).connect(audioContext.destination);
    }

    const handleToggle = () => {
        if (checked) {
            // Timerリセット
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            // ボリュームメーターリセット
            audioContext.suspend();
        } else {
            // Timer開始
            runTimerAction();
            // ボリュームメーター開始
            onStart();
            audioContext.resume();
        }
        setChecked(!checked);
    }

    return (
        <Box width="100%">
            <Typography sx={{ mt: 2 }}>
                ボリュームメーター
            </Typography>
            <Switch
                checked={checked}
                onChange={() => handleToggle()}
                inputProps={{ 'aria-label': 'controlled' }}
            />
            <p>{"平均値s:" + volume}</p>  {/* ワードカウントの表示 */}
            <p>{"経過時間: " + elapsedTime + "/20 秒"}</p>  {/* 経過時間の表示 */}
        </Box>
    );
}