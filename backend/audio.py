import spotipy
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

while True:
    track_name = input("曲名を入力してください: ")
    
    if track_name.lower() == "exit":
        break
    
    # Spotifyで曲を検索
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
