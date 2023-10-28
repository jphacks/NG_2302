from dataclasses import dataclass
import spotipy
from spotipy.oauth2 import SpotifyOAuth

from core.constants import SpotifyOAuthConstant, ErrorCode
from core.dtos.music import EnqueueReturnValue

# Spotipyのセットアップ
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=SpotifyOAuthConstant.SPOTIPY_CLIENT_ID,
    client_secret=SpotifyOAuthConstant.SPOTIPY_CLIENT_SECRET,
    redirect_uri=SpotifyOAuthConstant.SPOTIPY_REDIRECT_URI,
    scope=["user-read-playback-state", "user-modify-playback-state", "user-read-currently-playing"]
))


@dataclass(frozen=True)
class MusicService:
    account_id: int

    def enqueue(
        self,
        music_title: str
    ) -> EnqueueReturnValue:
        # Spotifyで曲を検索
        result = sp.search(q=music_title, limit=1)
        items = result['tracks']['items']

        if items:
            track_id = items[0]['id']
            sp.add_to_queue(f"spotify:track:{track_id}")
        else:
            print(f"Could not find music '{music_title}'")
            return EnqueueReturnValue(error_codes=(ErrorCode.MUSIC_NOT_FOUND,))
        return EnqueueReturnValue(error_codes=())
