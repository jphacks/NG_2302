import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Typography, Switch, Box } from "@mui/material";
import { backendUrl } from '../config/backendUrl';
import { withAuthHeader } from '../config/Headers';
import { useElapsedTime } from "../hooks/ElapsedTimeHook";

const audioContext = new AudioContext();
var count = 0;
var volSum = 0;

export const VolumeMeter = () => {
    const [inProgress, setInProgress] = useState(false);
    const [checked, setChecked] = useState(false);
    const [volume, setVolume] = useState(0);
    const [cookies] = useCookies(['access_token']);
    //経過時間を格納するためのState
    const {elapsedTime, runTimerAction, timerReset} = useElapsedTime(20);

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

    const onAction = () => {
        //60秒経過時のロジック
        postAdjustVolume(volSum / 200);
    }

    useEffect(() => {
        if (checked) {
            runTimerAction(onAction);
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
            timerReset();
            // ボリュームメーターリセット
            audioContext.suspend();
        } else {
            // Timer開始
            runTimerAction(onAction);
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