from enum import IntEnum


class DBConstant:
    DB_URL = "mysql+pymysql://root@db:3306/CarDJ?charset=utf8"


class SpotifyOAuthConstant:
    # Spotifyの認証情報
    SPOTIPY_REDIRECT_URI = 'https://cardj-web-mgtirivoza-an.a.run.app'


class SentimentAnalysisConstant:
    CREDENTIALS_PATH = "dj-hukkin.json"
    SCORE_COEFFICIENT = 0.1
    MAGNITUDE_COEFFICIENT = 0.5


class ErrorCode(IntEnum):
    LOGIN_ID_ALREADY_EXISTS = 0
    INVALID_LOGIN = 1
    MUSIC_NOT_FOUND = 2
    SPOTIFY_NOT_REGISTERED = 3
    NO_ACTIVE_DEVICE = 4
    VOLUME_PERCENT_OUT_OF_RANGE = 5
    MUSIC_ALREADY_IN_QUEUE = 6
    QUEUE_SIZE_ABOVE_THRESHOLD = 7
