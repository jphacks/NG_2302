import React from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Box, Button, Grid, Typography, Switch } from '@mui/material';
import { useCookies } from 'react-cookie';
import { backendUrl } from '../config/backendUrl';

export const Dictaphone = () => {
	const [message, setMessage] = React.useState('');
	const [wordCount, setWordCount] = React.useState(0);
	const [elapsedTime, setElapsedTime] = React.useState(0);//経過時間を格納するためのState
	const [cookies] = useCookies(['access_token']);
	const [checked, setChecked] = React.useState(false);
	var intervalRef = React.useRef(null);	

	const commands = [
		{
			// 特定のワードの後に起動して、valueでそのあとのワードを回収できる
			command: '腹筋*',
			callback: async (value) => {
				console.log(value);
				const authorization = 'Bearer ' + cookies.access_token;
				const header = {
					'Content-Type': 'application/json',
					'Authorization': authorization,
				}
				try {
					await axios.post(
						backendUrl + '/music/enqueue',
						{ music_title: value },
						{ headers: header },
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
		{
			command: '*',
			callback: (value) => {
				console.log(value);
				const words = value.split(' ').length; // 語数をカウント
				setWordCount(prevCount => prevCount + words);
			},
		},
	];

	const postAdjustVolume = async (volume) => {
		const authorization = 'Bearer ' + cookies.access_token;
		const header = {
			'Content-Type': 'application/json',
			'Authorization': authorization,
		}
		const json = {
			volume_percent: volume,
		}

		try {
			await axios.post(backendUrl + '/music/adjust_volume', json, { headers: header })
				.then(res => {
					console.log(res.data);
				});
		} catch (error) {
			console.error('Adjust volume failed:', error);
		}
	}

	function setTimer() {
		if (intervalRef.current !== null) return;

		intervalRef.current = setInterval(() => {
			// 1分間隔で音量を調節
			// wordCountに基づいて音量を決定する
			setElapsedTime(prevTime => {
				if (prevTime >= 60) {
					//60秒経過時のロジック
					let volume;
					if (wordCount <= 30) {
						volume = 60;
					} else if (wordCount <= 60) {
						volume = 75;
					} else {
						volume = 90;
					}

					// wordCountはint
					// volumeはstring
					// 求められているのはinteger
					// -> Volumeだと422(サーバーが読み取れないよ)ってエラーになる
					postAdjustVolume(volume);

					setWordCount(0); //語数リセット
					return 0; //経過時間リセット
				}
				return prevTime + 1; // 1秒インクリメント
			});
		}, 1000); // 1秒ごと
	}

	React.useEffect(() => {
		console.log('call useEffect: '+checked);
		if (checked) {
			setTimer();

			// return () => clearInterval(intervalRef.current); // クリーンアップ
		}		
	}, [wordCount]);

	const handleChange = (event) => {
		console.log(event.target.checked);
		if (!event.target.checked) {
			if (intervalRef.current !== null) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		} else {
			setTimer();
		}
		setChecked(event.target.checked);
	}

	const {
		transcript,
		resetTranscript,
		browserSupportsSpeechRecognition,
	} = useSpeechRecognition({ commands });

	if (!browserSupportsSpeechRecognition) {
		return <span>ブラウザが音声認識未対応です</span>;
	}

	function onRestart() {
		onEnd();
		onStart();
	}

	function onStart() {
		SpeechRecognition.startListening({
			continuous: true,
			language: 'ja-JP'
		});
	}

	// 使ってないが一応残す
	function onEnd() {
		SpeechRecognition.stopListening();
	}

	// 読み込まれた時点で起動する。
	onStart();

	return (
		<Box width="100%">
			<p>{"特定のワードの後:" + message}</p>
			<p>{"現在の語数:" + wordCount}</p>  {/* ワードカウントの表示 */}
			<p>{"経過時間: " + elapsedTime + "/60 秒"}</p>  {/* 経過時間の表示 */}
			<p>{transcript}</p>
			<Button variant="contained" color="tertiary" onClick={() => onRestart()}>
				Reset
			</Button>
			<Grid container >
				<Switch
					checked={checked}
					onChange={handleChange}
					inputProps={{ 'aria-label': 'controlled' }}
				/>
				<Typography component="h4" variant="div" sx={{ ml: 2, mt: 1 }}>
					自動音量調整
				</Typography>
			</Grid>
		</Box>
	)
}