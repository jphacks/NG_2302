import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Box, Button, Switch } from '@mui/material';
import { useCookies } from 'react-cookie';
import { backendUrl } from '../config/backendUrl';
import { withAuthHeader } from '../config/Headers';
import { useElapsedTime } from '../hooks/ElapsedTimeHook';

export const Dictaphone = () => {
    const [titleName, setTitleName] = useState('');
    const [sentence, setSentence] = useState('');
    const [cookies] = useCookies(['access_token']);
    const { runTimerAction, timerReset } = useElapsedTime(60);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        // 読み込まれた時点で起動する。
        onStart();
        runTimerAction(onAction);
    }, []);

    const commands = [
        {
            // 特定のワードの後に起動して、valueでそのあとのワードを回収できる
            command: '腹筋*',
            callback: async (value) => {
                console.log(value);
                try {
                    const body = {
                        music_title: value
                    }
                    await axios.post(
                        `${backendUrl}/music/enqueue`,
                        body,
                        withAuthHeader(cookies.access_token),
                    ).then(res => {
                        console.log(res.data);
                        // ここ変更しなければならない
                        window.location.reload();
                    });
                } catch (error) {
                    console.error('Enqueue failed:', error);
                }
                setTitleName(value);
            },
        },
        {
            // すべての会話をログに残し、ネガポジに使用する
            command: '*',
            callback: (value) => {
                setSentence(sentence + value);
            },
        }
    ];

    const onAction = async () => {
        try {
            const body = {
                conversation: sentence,
            }
            await axios.post(
                `${backendUrl}/music/enqueue_based_on_mood`,
                body,
                withAuthHeader(cookies.access_token),
            )
            console.log(sentence);
        } catch (error) {
            console.error('enqueue_based_on_mood failed:', error);
        }
    }

    const {
        transcript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition({ commands });

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
        onStop();
        onStart();
    }

    function onStop() {
        SpeechRecognition.stopListening();
    }

    const handleToggle = () => {
        if (checked) {
            // Timerリセット
            timerReset();
            onStop();
        } else {
            // Timer開始
            runTimerAction(onAction);
            onStart();
        }
        setChecked(!checked);
    }

    return (
        <Box width="100%">
            <p>{`特定のワードの後:${titleName}`}</p>
            <p>{transcript}</p>
            <Button variant="contained" color="tertiary" onClick={() => onRestart()}>
                Reset
            </Button>
            <p>ネガポジ判定機能の動作</p>
            <Switch
                checked={checked}
                onChange={() => handleToggle()}
                inputProps={{ 'aria-label': 'controlled' }}
            />
        </Box>
    )
}