import React, { useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Box, Switch } from '@mui/material';
import { useCookies } from 'react-cookie';
import { postEnqueue, postEnqueueBasedOnMood } from '../utils/ApiService';

export const Dictaphone = () => {
    const [titleName, setTitleName] = useState('');
    // 画面に表示するための状態管理
    const [conversation, setConversation] = useState('');
    // 静的に保存するためのuseRef
    const conversationRef = useRef('');
    const [cookies] = useCookies(['access_token', 'client_id']);
    const [checked, setChecked] = useState(false);
    //経過時間を格納するためのState
    const intervalRef = useRef(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    let maxTime = 60;

    const commands = [
        {
            // 特定のワードの後に起動して、valueでそのあとのワードを回収できる
            command: '腹筋 * 牛乳',
            fuzzyMatchingThreshold: 0.5,
            callback: async (value) => {
                // queueに追加
                console.log(value);
                try {
                    await postEnqueue(value, cookies.access_token, cookies.client_id);
                } catch (error) { }
                setTitleName(value);
            },
        },
    ];

    const {
        transcript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition({ commands });

    useEffect(() => {
        // 読み込まれた時点で起動する。
        onStart();
        if (checked) {
            runTimerAction();
        }
    }, []);

    useEffect(() => {
        if (checked) {
            conversationRef.current += transcript;
            setConversation(transcript);
        }
    }, [transcript]);

    // Hooksに怒られるからuseEffectのあと
    if (!browserSupportsSpeechRecognition) {
        return <span>ブラウザが音声認識未対応です</span>;
    }

    const onAction = async () => {
        if (conversationRef.current === '') return;
        try {
            await postEnqueueBasedOnMood(
                conversationRef.current, cookies.access_token, cookies.client_id);
            setConversation(conversationRef.current);
            console.log(`conversation: ${conversationRef.current}`);
            // リセット
            conversationRef.current = '';
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

    function onStart() {
        SpeechRecognition.startListening({
            continuous: true,
            language: 'ja'
        });
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