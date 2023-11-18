import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { ModeStorage } from '../hooks/ModeHook';
import { ModeTypes } from '../config/ModeTypes';
import { postToken } from '../utils/ApiService';
import { registerUserAccount } from '../utils/Firebase';

export const QrAuth = () => {
    const [message, setMessage] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'client_id']);
    const navigate = useNavigate();
    const modeStorage = new ModeStorage();

    // ページが呼ばれた時に初期化処理
    useEffect(() => {
        // URLからクエリパラメータを取得
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        // クエリパラメータからJSONデータを取得
        const jsonDataString = urlParams.get('data');

        // JSONデータをパース
        const jsonData = JSON.parse(decodeURIComponent(jsonDataString));

        const initLoad = async () => {
            try {
                const data = await postToken(jsonData.id, jsonData.password);
                setCookie('access_token', data.access_token);

                removeCookie('client_id');
                const clientId = await registerUserAccount(jsonData.id);
                if (clientId !== 'undefined') {
                    setCookie('client_id', clientId);
                }

                // QR認証の時は確定でユーザーとなる
                modeStorage.setMode(ModeTypes.USER);
                navigate('/home');
            } catch (error) {
                setMessage('Login failed. Please check your credentials.');
            }
        }
        initLoad();
    }, [])

    return (<>{message}</>)
}