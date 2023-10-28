# car-dj-spotify

## Python 実行環境セットアップ

### Pythonのバージョン

```
python=3.11.4
```

### ライブラリのインストール

下記コマンドを`requirements.txt`の存在するディレクトリ下(`.backend/`)で実行

```
pip install -r requirements.txt
```

### 開発サーバー起動

下記コマンドを`.backend/`で実行

```
uvicorn main:app --reload
```

### Swagger

http://localhost:8000/docs
