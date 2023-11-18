import React, { useEffect, useState } from 'react';
import { apiClient } from '../utils/ApiService';
import { Alert, Snackbar } from '@mui/material';

export const AxiosClientProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState('error');
    const [message, setMessage] = useState('');

    const handleClose = () => {
        setOpen(false);
    }

    useEffect(() => {
        // AxiosのResponse時のInterceptor
        apiClient.interceptors.response.use(
            // 成功時のresponseはそのまま返す
            (response) => {
                setMessage('成功しました。');
                setSeverity('success');
                setOpen(true);
                return response;
            },
            // エラーハンドリング
            (error) => {
                switch (error.response?.status) {
                    case 401:
                        setMessage('アカウントにログインしていないか、Spotifyに未登録です。');
                        setSeverity('warning');
                        setOpen(true);
                        return Promise.reject(error.response?.data);
                    case 500:
                        setMessage('サーバーエラーが発生しました');
                        setSeverity('error');
                        setOpen(true);
                        return Promise.reject(error.response?.data);
                    default:
                        setMessage('予期せぬエラーが発生しました');
                        setSeverity('error');
                        setOpen(true);
                        return Promise.reject(error.response?.data);
                }
            }
        );

        return () => {
            try {
                apiClient.interceptors.response.eject();
            } catch (error) { }
        }
    }, []);

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={open}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
            {children}
        </>
    )
}