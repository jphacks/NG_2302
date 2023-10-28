import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Box, Button } from '@mui/material';

export const Dictaphone = () => {
  const [message, setMessage] = React.useState('');

  const commands = [
    {
      command: '*',
      callback: (value) => {
        console.log(value);
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
  ]

  const {
    transcript,
    resetTranscript,
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

  // 使ってないが一応残す
  function onEnd() {
    SpeechRecognition.stopListening();
  }

  // 読み込まれた時点で起動する。
  onStart();

  return (
    <Box width="100%">
      <p>{"特定のワードの後:"+message}</p>
      <p>{transcript}</p>
      <Button variant="contained" color="tertiary" onClick={() => resetTranscript()}>
        Reset
      </Button>
    </Box>
  )
}