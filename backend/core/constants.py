from enum import IntEnum


class DBConstant:
    DB_URL = "mysql+pymysql://root@localhost:3306/CarDJ?charset=utf8"


class SpotifyOAuthConstant:
    # Spotifyの認証情報
    SPOTIPY_CLIENT_ID = '65052712c7f74f378e2017737d21f9d5'
    SPOTIPY_CLIENT_SECRET = '644fe09a07464d159010b7cc8387ec22'
    SPOTIPY_REDIRECT_URI = 'http://localhost:3000'


class ErrorCode(IntEnum):
    LOGIN_ID_ALREADY_EXISTS = 0
    INVALID_LOGIN = 1
