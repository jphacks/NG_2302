from enum import IntEnum


class DBConstant:
    DB_URL = "mysql+pymysql://root:0000@localhost:3306/CarDJ?charset=utf8"


class SpotifyOAuthConstant:
    # Spotifyの認証情報
    SPOTIPY_REDIRECT_URI = 'http://localhost:3000'


class ErrorCode(IntEnum):
    LOGIN_ID_ALREADY_EXISTS = 0
    INVALID_LOGIN = 1
    MUSIC_NOT_FOUND = 2
    SPOTIFY_NOT_REGISTERED = 3
    NO_ACTIVE_DEVICE = 4
