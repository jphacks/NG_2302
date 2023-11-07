import { useState } from "react";
import { Grid, Typography, Switch } from "@mui/material";

const audioContext = new AudioContext();

export const VolumeMeter = () => {
    const [inProgress, setInProgress] = useState(false);
    const [checked, setChecked] = useState(false);
    const [volume, setVolume] = useState(0);

    const onProcess = (peak) => {
        /*
        const data = event.inputBuffer.getChannelData(0);
        const peak = data.reduce((max, sample) => {
            const cur = Math.abs(sample);
            return max > cur ? max : cur;
        });
        */
        // 75 = -75dB (基本的にデジタルオーディオの世界ではデシベルの値はマイナスになります)
        const percent = Math.round(100 / 75 * 10 * Math.log10(peak) + 100);
        console.log(percent);
        setVolume(percent);
    }

    const onStart = async () => {
        if (inProgress) return;
        setInProgress(true);

        await audioContext.audioWorklet.addModule('VolumeProcessor.js');
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const micNode = audioContext.createMediaStreamSource(mediaStream);
        const volumeMeterNode = new AudioWorkletNode(audioContext, 'volume-meter');
        volumeMeterNode.port.onmessage = (event) => {
            //console.log(event.data);
            onProcess(event.data)
            //setVolume(event.data);
        }
        micNode.connect(volumeMeterNode).connect(audioContext.destination);
    }

    const handleToggle = () => {
        if (checked) {
            audioContext.suspend();
            setChecked(false);
        } else {
            onStart();
            audioContext.resume();
            setChecked(true);
        }
    }

    return (
        <Grid container>
            <Switch
                checked={checked}
                onChange={() => handleToggle()}
                inputProps={{ 'aria-label': 'controlled' }}
            />
            <Typography>
                音量 : {volume}%
            </Typography>
        </Grid>
    );
}