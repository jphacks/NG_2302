import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Box, Button } from '@mui/material';

export const Dictaphone = () => {
  const [message, setMessage] = React.useState('');
  const [wordCount, setWordCount] = React.useState(0);
  const [elapsedTime, setElapsedTime] = React.useState(0);//経過時間を格納するためのState

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
      callback: (value) => {
        setMessage(value);
        console.log(value);
      },
    },
  ];

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

          fetch('/set-volume', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ volume })
          });

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
      <p>{"特定のワードの後:"+message}</p>
      <p>{"現在の語数:"+wordCount}</p>  {/* ワードカウントの表示 */}
      <p>{"経過時間: "+elapsedTime + "/60 秒"}</p>  {/* 経過時間の表示 */}
      <p>{transcript}</p>
      <Button variant="contained" color="tertiary" onClick={() => onRestert()}>
        Reset
      </Button>
    </Box>
  )
}