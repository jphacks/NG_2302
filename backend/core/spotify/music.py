from spotipy import Spotify


def start_playback(
    sp: Spotify,
    music_title: str
):
    if music_title:
        results = sp.search(q=music_title, type='track', limit=1)
        if results and results['tracks']['items']:
            track_uri = results['tracks']['items'][0]['uri']
            sp.start_playback(uris=[track_uri])
            return f"曲を再生中: {music_title}"
        else:
            return f"曲が見つかりません: {music_title}"
