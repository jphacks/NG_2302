import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../config/backendUrl';
import { Typography } from '@mui/material';
import { urlEncodedHeader } from '../config/Headers';

export const QrAuth = () => {
    const [message, setMessage] = useState('');
    const [cookies, setCookie] = useCookies(['access_token', 'refresh_token']);
    const navigate = useNavigate();

    // ページが呼ばれた時に初期化処理
    useEffect(() => {
        // URLからクエリパラメータを取得
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        // クエリパラメータからJSONデータを取得
        const jsonDataString = urlParams.get('data');

        // JSONデータをパース
        const jsonData = JSON.parse(decodeURIComponent(jsonDataString));

        console.log(jsonData); // JSONデータがコンソールに表示されます

        // トークンを発行する
        const json = {
            username: jsonData.id,
            password: jsonData.password
        };
        try {
            axios.post(`${backendUrl}/auth/token`, json, urlEncodedHeader)
                .then((res) => {
                    setCookie('access_token', res.data.access_token);
                    setCookie('refresh_token', res.data.refresh_token);
                    navigate('/home');
                });
        } catch (error) {
            console.error('Login failed:', error);
            setMessage('Login failed. Please check your credentials.');
        }
    }, [])

    return (
        <div>
            <Typography>
                {message}
            </Typography>
        </div>
    )
}