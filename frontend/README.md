# フロントエンド

## React 実行環境セットアップ

### npmのインストール

Node.jsがインストールされていることを前提とします。
ターミナルで`./frontend`のディレクトリへ行き、下記コマンドを実行
```
npm install
```

### React Routerのインストール

ルーティングの制御でReact Routerを使用します。
そのため、`./frontend`こちらの階層で、下記コマンドを実行

```
npm install react-router-dom@6
```

### MUIのインストール

Material UIライブラリを使用します。
そのため、`./frontend`こちらの階層で、下記コマンドを実行

```
npm install @mui/material @emotion/react @emotion/styled
```

※この時Reactのバージョンは以下に合わせてください。
```
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0",
  "react-dom": "^17.0.0 || ^18.0.0"
},
```

### Speech Recognition APIのインストール

音声認識のために、Speech Recognition APIを使用します。
そのため、`./frontend`こちらの階層で、下記コマンドを実行

```
npm install react-speech-recognition
```

### 開発サーバー起動

下記コマンドを`.frontend/`で実行

```
npm start
```
