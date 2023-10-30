# DJふっきん

[![IMAGE ALT TEXT HERE](https://jphacks.com/wp-content/uploads/2023/07/JPHACKS2023_ogp.png)](https://www.youtube.com/watch?v=yYRQEdfGjEg)

## 製品概要

車の乗員全員の聞きたい楽曲を流すために、車内のDJを担ってくれるサービス

デモ/紹介動画: https://youtu.be/oG7NVwTY7wE

### 背景(製品開発のきっかけ、課題等）

最近運転免許を取ったので、友達と車で旅行に行くことがよくあるが、その時に車で音楽をかけることがよくある。

車のスピーカーの接続上限の関係で大抵の車のスピーカーには音楽再生端末を一台しか接続できないが、流したいBGMは乗員全員異なるため、全員に端末を回したり流したい曲を聞いて回ったりと毎回手間がかかって不便だった。

そこで、"全員に端末を回したり流したい曲を聞いて回ったり"する役割をサービスに代替すれば車での旅行がより楽しめると考え、今回のプロジェクトの開発に至った。

### 製品説明（具体的な製品の説明）

* 車に接続するホスト端末で再生する音楽を、クライアント端末から選べるようにするためのスマートフォン向けWebサイト。

* ホスト端末のSpotifyアカウントに対してクライアント端末から曲をリクエストすることで音楽のキューを構築し、再生する音楽のリストを乗員全員で作っていくサービス。

* 運転手はクライアント端末を操作できないため、代わりに音声認識によって曲をリクエストする機能を実装。これにより運転手だけ曲をリクエストできないという不公平性を解消。

* また、車内の雰囲気を自動で判定して端末のSpotifyの音量を調整する機能を実装。これにより、車内が静かになったのに端末の音量が大きくて話が聞こえないなどの問題を解消。

### 特長
#### 1. 特長1

ドライバーが、手が空かないため音楽のリクエストを送りづらいという問題に対して、音声認識機能を用いて手を使わずとも音楽のリクエストを送れるようにしました。

#### 2. 特長2

車内の搭乗員のテンションによって、音楽の音量を自動的に変える機能を実装しました。これは、車内の会話を自然言語処理して形態素解析を行なって会話の頻度を取得することで車内の搭乗員のテンションを推定し、雰囲気に応じて音楽の音量を調整するという形で実装しています。

#### 3. 特長3

ユーザーのSpotifyのアカウントを扱うということでセキュリティ面を重視し、JWTや秘密鍵認証による堅牢なバックエンドを実装しました。

#### 4. 特長4

QRコードによるアカウント認証を可能にすることで、ログインの煩雑さを解消しUXを向上しました。

### 解決出来ること

車での旅行において、搭乗員各位の流したい音楽を流せるようになる。また、車内の音楽を決めるためのコミュニケーションコスト、作業が減ることで旅行を楽しむ余裕が生まれる。

また、ツアーバス内などにおいてこのサービスを用いることで乗客全員が聞きたい音楽を流すことができ、世代間の好みの差の問題の解消や、ツアー運営側が選曲を行うコストの削減など多様なメリットをもたらすことができると考える。

### 今後の展望

* アーティスト検索機能
* キューの入れ替え機能
* キューの削除機能
* 車内の雰囲気によって音楽の曲調、テンポを変える機能
* リクエストされた音楽から、おすすめの音楽を推定して自動で流す機能
* 形態素解析された会話の内容がネガティブなものかポジティブなものかを判断して、自動で流す曲を長調にするか短調にするかを自動で選択する機能

などを実装する予定です！

### 注力したこと（こだわり等）

* 裏で音声認識のライブラリを立ち上げて、特定のワード"腹筋"に反応して、続く言葉を曲名として認識し、曲のリクエストが行われるようにする機能を実装した。
* 音声認識をフロントエンドで実装することにより、通信の削減を実現しています。
* 現在流れているSpotifyの音楽、およびキューに並んでいる音楽を取得してアーティスト名や画像を表示できるようにしました。また、端末のキューの情報が切り替わった際(曲が切り替わったりキューが追加されるなど)に、通信を最小限にして適切にキューの情報を更新できるようにしています。

## 開発技術
### 活用した技術
#### API・データ

* Spotify API
* Google Speech Recognition

#### フレームワーク・ライブラリ・モジュール

フロントエンド
* React.js
* Speach Recognition
* React-Cookie
* Material UI

バックエンド
* FastAPI
* MySQL

#### デバイス

* iOS
* Android
* Nokia

使用用途的に上記がターゲットではあるが、その他の端末でもブラウザから接続すれば問題なく使用できる

### 独自技術
#### ハッカソンで開発した独自機能・技術

* 独自で開発したものの内容をこちらに記載してください

取得した車内の音声から車内の雰囲気を推定し、雰囲気に合わせて端末のSpotifyの音量を自動調整する機能を実装しています。

* 特に力を入れた部分をファイルリンク、またはcommit_idを記載してください。

https://github.com/jphacks/NG_2302/commit/e964cf1d84c409b49783e18edab2c71e816ee82e
https://github.com/jphacks/NG_2302/blob/master/backend/core/services/music.py

#### 製品に取り入れた研究内容（データ・ソフトウェアなど）（※アカデミック部門の場合のみ提出必須）
* 
* 
