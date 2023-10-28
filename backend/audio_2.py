import spotipy
import speech_recognition as sr
from spotipy.oauth2 import SpotifyOAuth
from core.constants import SpotifyOAuthConstant

# Spotipyのセットアップ
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=SpotifyOAuthConstant.SPOTIPY_CLIENT_ID,
    client_secret=SpotifyOAuthConstant.SPOTIPY_CLIENT_SECRET,
    redirect_uri=SpotifyOAuthConstant.SPOTIPY_REDIRECT_URI,
    scope=["user-read-playback-state", "user-modify-playback-state", "user-read-currently-playing"]
))

# キューの初期化
queue = []

recognizer = sr.Recognizer()

while True:
    print("曲名を教えてください。")
    with sr.Microphone() as source:
        audio_data = recognizer.listen(source)
        try:
            track_name = recognizer.recognize_google(audio_data, language="ja-JP")
            print(f"認識した曲名: {track_name}")
        except sr.UnknownValueError:
            print("音声を認識できませんでした。もう一度お試しください。")
            continue
        except sr.RequestError:
            print("音声認識サービスに接続できませんでした。")
            continue

    if track_name.lower() == "exit":
        break

    # spotifyで曲を検索
    results = sp.search(q=track_name, limit=1)
    tracks = results['tracks']['items']

    if tracks:
        track_id = tracks[0]['id']
        queue.append(track_id)

        # キューの最初の曲を再生
        if len(queue) == 1:
            sp.start_playback(uris=[f"spotify:track:{track_id}"])
        else:
            sp.add_to_queue(f"spotify:track:{track_id}")
    else:
        print(f"'{track_name}' という曲は見つかりませんでした。")

print("終了しました。")
