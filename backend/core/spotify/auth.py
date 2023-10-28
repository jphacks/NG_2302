import spotipy
from spotipy.oauth2 import SpotifyOAuth

from core.constants import SpotifyOAuthConstant


def get_spotify_instance() -> spotipy.Spotify:
    sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
        client_id=SpotifyOAuthConstant.SPOTIPY_CLIENT_ID,
        client_secret=SpotifyOAuthConstant.SPOTIPY_CLIENT_SECRET,
        redirect_uri=SpotifyOAuthConstant.SPOTIPY_REDIRECT_URI,
        scope=["user-read-playback-state", "user-modify-playback-state", "user-read-currently-playing"]
    ))
    return sp
