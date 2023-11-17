import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { Typography, Switch, Box } from "@mui/material";
import { postAdjustVolume } from "../utils/ApiService";

const audioContext = new AudioContext();
var count = 0;
var volSum = 0;

export const VolumeMeter = () => {
    const [inProgress, setInProgress] = useState(false);
    const [checked, setChecked] = useState(false);
    const [volume, setVolume] = useState(0);
    const [cookies] = useCookies(['access_token']);
    //経過時間を格納するためのState
    const intervalRef = useRef(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    let maxTime = 20;

    //20秒経過時のロジック
    const onAction = async () => {
        await postAdjustVolume(volSum / 200, cookies.access_token);
    }

    function runTimerAction() {
        if (intervalRef.current !== null) return;

        intervalRef.current = setInterval(() => {
            setElapsedTime(prevTime => {
                if (prevTime >= maxTime) {
                    onAction();

                    // 経過時間リセット
                    return 0;
                } else {
                    // インクリメント
                    return prevTime + 1;
                }
            });

        }, 1000)
    }

    function timerReset() {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setElapsedTime(0);
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
            const average = Math.round((volSum + value) / count * 100) / 100
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
            <p>{"経過時間: " + elapsedTime + `/${maxTime} 秒`}</p>  {/* 経過時間の表示 */}
        </Box>
    );
}