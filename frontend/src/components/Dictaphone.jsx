import React, { useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Box, Button, Switch } from '@mui/material';
import { useCookies } from 'react-cookie';
import { postEnqueue, getQueueInfo, postEnqueueBasedOnMood } from '../utils/ApiService';

export const Dictaphone = ({ setMusicInfo }) => {
    const [titleName, setTitleName] = useState('');
    // 画面に表示するための状態管理
    const [conversation, setConversation] = useState('');
    // 静的に保存するためのuseRef
    const conversationRef = useRef('');
    const [cookies] = useCookies(['access_token', 'id']);
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
            command: '腹筋*牛乳',
            fuzzyMatchingThreshold: 0.5,
            callback: async (value) => {
                // queueに追加
                console.log(value);
                try {
                    await postEnqueue(value, cookies.access_token, cookies.id);
                    setTitleName(value);
                    // 曲のリストを更新
                    const data = await getQueueInfo(cookies.access_token);
                    setMusicInfo(data);
                } catch (error) { }
            },
        },
        {
            // すべての会話をログに残し、ネガポジに使用する
            command: '*',
            callback: (value) => {
                conversationRef.current += value;
                setConversation(conversationRef.current);
            },
        }
    ];

    const onAction = async () => {
        if (conversationRef.current === '') return;
        try {
            await postEnqueueBasedOnMood(
                conversationRef.current, cookies.access_token, cookies.id);
            setConversation(conversationRef.current);
            console.log(`conversation: ${conversationRef.current}`);
            // リセット
            conversationRef.current = '';
            // 曲のリストを更新
            try {
                const data = await getQueueInfo(cookies.access_token);
                setMusicInfo(data);
            } catch (error) { }
        } catch (error) { }
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
            language: 'ja'
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
            <p>{`特定のワードの後「${titleName}」`}</p>
            <p>{conversation}</p>
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