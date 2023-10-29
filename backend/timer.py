import spotipy
from spotipy.oauth2 import SpotifyOAuth

# あなたのアプリケーションの認証情報をセットアップ
SPOTIPY_CLIENT_ID = 'YOUR_SPOTIPY_CLIENT_ID'
SPOTIPY_CLIENT_SECRET = 'YOUR_SPOTIPY_CLIENT_SECRET'
SPOTIPY_REDIRECT_URI = 'YOUR_SPOTIPY_REDIRECT_URI'

# 認証をセットアップ
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=SPOTIPY_CLIENT_ID,
    client_secret=SPOTIPY_CLIENT_SECRET,
    redirect_uri=SPOTIPY_REDIRECT_URI,
    scope='user-read-playback-state'  # これは再生情報を取得するための権限
))

# 現在の再生情報を取得
playback_info = sp.current_playback()

# 楽曲の全体の時間と現在の再生位置を取得
duration_ms = playback_info['item']['duration_ms']
progress_ms = playback_info['progress_ms']

# 残りの再生時間を計算（ミリ秒）
remaining_ms = duration_ms - progress_ms

# ミリ秒を分と秒に変換
minutes, milliseconds = divmod(remaining_ms, 60000)
seconds = milliseconds // 1000

print(f"残り時間: {minutes}分 {seconds}秒")
