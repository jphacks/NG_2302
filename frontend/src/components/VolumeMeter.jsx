import { useState } from "react";
import { Box, Typography } from "@mui/material";

export const VolumeMeter = () => {
    const [volume, setVolume] = useState(0);
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    const onProcess = (event) => {
        const data = event.inputBuffer.getChannelData(0);
        const peak = data.reduce((max, sample) => {
            const cur = Math.abs(sample);
            return max > cur ? max : cur;
        });
        // 75 = -75dB (基本的にデジタルオーディオの世界ではデシベルの値はマイナスになります)
        setVolume(Math.round(100 / 75* 10 * Math.log10(peak) + 100));
    }

    const onStart = async () => {
        const media = await navigator.mediaDevices
            .getUserMedia({ audio: true })
            .catch(console.error);
        const ctx = new AudioContext();
        console.log('Sampling Rate:', ctx.sampleRate);

        const processor = ctx.createScriptProcessor(4096, 1, 1);
        processor.onaudioprocess = onProcess;
        processor.connect(ctx.destination);

        const source = ctx.createMediaStreamSource(media);
        source.connect(processor);
    }

    // 読み込まれた時点で起動する。
    onStart();

    return (
        <Box>
            <Typography>
                音量 : { volume }%
            </Typography>
        </Box>
    );
}