import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import { ModeStorage } from '../hooks/ModeHook';
import { ModeTypes } from '../config/ModeTypes';
import { postToken } from '../utils/ApiService';

export const QrAuth = () => {
    const [message, setMessage] = useState('');
    const [cookies, setCookie] = useCookies(['access_token', 'refresh_token']);
    const navigate = useNavigate();
    const modeStorage = new ModeStorage();

    // ページが呼ばれた時に初期化処理
    useEffect(async () => {
        // URLからクエリパラメータを取得
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        // クエリパラメータからJSONデータを取得
        const jsonDataString = urlParams.get('data');

        // JSONデータをパース
        const jsonData = JSON.parse(decodeURIComponent(jsonDataString));

        try {
            const data = await postToken(jsonData.id, jsonData.password);
            setCookie('access_token', data.access_token);
            setCookie('refresh_token', data.refresh_token);
            // QR認証の時は確定でユーザーとなる
            modeStorage.setMode(ModeTypes.USER);
            navigate('/home');
        } catch (error) {
            setMessage('Login failed. Please check your credentials.');
        }
    }, [])

    return (
        <>
            <Typography>
                {message}
            </Typography>
        </>
    )
}