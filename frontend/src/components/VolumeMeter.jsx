import { useState } from "react";
import { Grid, Typography, Switch } from "@mui/material";

const audioContext = new AudioContext();

export const VolumeMeter = () => {
    const [inProgress, setInProgress] = useState(false);
    const [checked, setChecked] = useState(false);
    const [volume, setVolume] = useState(0);

    const onStart = async () => {
        if (inProgress) return;
        setInProgress(true);

        await audioContext.audioWorklet.addModule('VolumeProcessor.js');
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const micNode = audioContext.createMediaStreamSource(mediaStream);
        const volumeMeterNode = new AudioWorkletNode(audioContext, 'volume-meter');
        volumeMeterNode.port.onmessage = (event) => {
            console.log(event.data);
            setVolume(Math.round(event.data * 100000)/100);
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
            <Typography sx={{ml: 2, mt: 1}}>
                音量 : {volume}%
            </Typography>
        </Grid>
    );
}