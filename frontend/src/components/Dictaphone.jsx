import React from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Box, Button } from '@mui/material';
import { useCookies } from 'react-cookie';
import { backendUrl } from '../config/backendUrl';

export const Dictaphone = () => {
	const [message, setMessage] = React.useState('');
	const [wordCount, setWordCount] = React.useState(0);
	const [elapsedTime, setElapsedTime] = React.useState(0);//経過時間を格納するためのState
	const [cookies] = useCookies(['access_token']);

	const commands = [
		{
			command: '*',
			callback: (value) => {
				console.log(value);
				const words = value.split(' ').length; // 語数をカウント
				setWordCount(prevCount => prevCount + words);
			},
		},
		{
			// 特定のワードの後に起動して、valueでそのあとのワードを回収できる
			command: 'あいうえお*',
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
					});
				} catch (error) {
					console.error('Enqueue failed:', error);
				}
				setMessage(value);
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

	React.useEffect(() => {
		const timer = setInterval(() => {
			// 1分間隔で音量を調節
			// wordCountに基づいて音量を決定する
			setElapsedTime(prevTime => {
				if (prevTime >= 60) {
					//60秒経過時のロジック
					let volume;
					if (wordCount <= 50) {
						volume = "low";
					} else if (wordCount <= 120) {
						volume = "medium";
					} else {
						volume = "high";
					}

					// wordCountはint
					// volumeはstring
					// 求められているのはinteger
					// -> Volumeだと422(サーバーが読み取れないよ)ってエラーになる
					postAdjustVolume(wordCount);

					setWordCount(0); //語数リセット
					return 0; //経過時間リセット
				}
				return prevTime + 1; // 1秒インクリメント
			});
		}, 1000); // 1秒ごと

		return () => clearInterval(timer); // クリーンアップ
	}, [wordCount]);

	React.useEffect(() => {
		const timer = setInterval(() => {
			setElapsedTime(prevTime => prevTime + 10); // 10秒ごとに経過時間をインクリメント
		}, 10000); // 10秒ごと

		return () => clearInterval(timer);
	}, []);

	const {
		transcript,
		resetTranscript,
		browserSupportsSpeechRecognition,
	} = useSpeechRecognition({ commands });

	if (!browserSupportsSpeechRecognition) {
		return <span>ブラウザが音声認識未対応です</span>;
	}

	function onRestert() {
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
			<Button variant="contained" color="tertiary" onClick={() => onRestert()}>
				Reset
			</Button>
		</Box>
	)
}