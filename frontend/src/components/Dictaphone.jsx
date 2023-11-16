import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Box, Button, Switch } from '@mui/material';
import { useCookies } from 'react-cookie';
import { backendUrl } from '../config/backendUrl';
import { withAuthHeader } from '../config/Headers';

export const Dictaphone = () => {
    const [titleName, setTitleName] = useState('');
    // 画面に表示するための状態管理
    const [sentence, setSentence] = useState('');
    // 静的に保存するためのuseRef
    const conversationRef = useRef('');
    const [cookies] = useCookies(['access_token']);
    const [checked, setChecked] = useState(false);
    //経過時間を格納するためのState
    const intervalRef = useRef(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    let maxTime = 60;

    useEffect(() => {
        // 読み込まれた時点で起動する。
        onStart();
        if (checked) {
            runTimerAction();
        }
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
                conversationRef.current += value;
                setSentence(conversationRef.current);
            },
        }
    ];

    const onAction = async () => {
        if (conversationRef.current === '') return;
        const tmp = conversationRef.current;
        conversationRef.current = '';
        setSentence(conversationRef.current);
        const body = {
            conversation: tmp,
        }
        try {
            await axios.post(
                `${backendUrl}/music/enqueue_based_on_mood`,
                body,
                withAuthHeader(cookies.access_token),
            );
            console.log(`sentence: ${tmp}`);
        } catch (error) {
            console.error('enqueue_based_on_mood failed:', error);
        }
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

    const {
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
        } else {
            // Timer開始
            runTimerAction();
        }
        setChecked(!checked);
    }

    return (
        <Box width="100%">
            <p>{`特定のワードの後:${titleName}`}</p>
            <p>{sentence}</p>
            <Button variant="contained" color="tertiary" onClick={() => onRestart()}>
                Reset
            </Button>
            <p>ネガポジ判定機能の動作</p>
            <Switch
                checked={checked}
                onChange={() => handleToggle()}
                inputProps={{ 'aria-label': 'controlled' }}
            />
            <p>{"経過時間: " + elapsedTime + `/${maxTime} 秒`}</p>  {/* 経過時間の表示 */}
        </Box>
    )
}