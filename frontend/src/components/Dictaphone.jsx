import React from 'react';
import axios from 'axios';
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import {Box, Button} from '@mui/material';
import {useCookies} from 'react-cookie';
import {backendUrl} from '../config/backendUrl';
import {withAuthHeader} from '../config/Headers';

export const Dictaphone = () => {
    const [message, setMessage] = React.useState('');
    const [cookies] = useCookies(['access_token']);
    const [checked, setChecked] = React.useState(false);

    const commands = [
        {
            // 特定のワードの後に起動して、valueでそのあとのワードを回収できる
            command: '腹筋*',
            callback: async (value) => {
                console.log(value);
                try {
                    await axios.post(
                        `${backendUrl}/music/enqueue`,
                        {music_title: value},
                        withAuthHeader(cookies.access_token),
                    ).then(res => {
                        console.log(res.data);
                        window.location.reload();
                    });
                } catch (error) {
                    console.error('Enqueue failed:', error);
                }
                setMessage(value);
            },
        },
    ];

    const {
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition({commands});

    if (!browserSupportsSpeechRecognition) {
        return <span>ブラウザが音声認識未対応です</span>;
    }

    function onStart() {
        SpeechRecognition.startListening({
            continuous: true,
            language: 'ja-JP'
        });
    }

    function onRestart() {
        onEnd();
        onStart();
    }

    function onEnd() {
        SpeechRecognition.stopListening();
    }

    // 読み込まれた時点で起動する。
    onStart();

    return (
        <Box width="100%">
            <p>{"特定のワードの後:" + message}</p>
            <p>{transcript}</p>
            <Button variant="contained" color="tertiary" onClick={() => onRestart()}>
                Reset
            </Button>
        </Box>
    )
}