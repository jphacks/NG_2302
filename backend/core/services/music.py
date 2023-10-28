from dataclasses import dataclass
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from spotipy.exceptions import SpotifyException
from sqlalchemy.orm import Session

from core.constants import SpotifyOAuthConstant, ErrorCode
from core.daos.spotify import SpotifyApiIdDao
from core.dtos.music import EnqueueReturnValue


@dataclass(frozen=True)
class MusicService:
    db: Session
    spotify_api_id_dao: SpotifyApiIdDao
    account_id: int

    def enqueue(
        self,
        music_title: str
    ) -> EnqueueReturnValue:
        # Spotifyのインスタンスを取得
        spotify_api_id = self.spotify_api_id_dao.read_record_by_account_id(
            db=self.db,
            account_id=self.account_id
        )
        if spotify_api_id is None:
            return EnqueueReturnValue(error_codes=(ErrorCode.SPOTIFY_NOT_REGISTERED,))

        # Spotipyのセットアップ
        sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
            client_id=spotify_api_id.spotify_client_id,
            client_secret=spotify_api_id.spotify_client_secret,
            redirect_uri=SpotifyOAuthConstant.SPOTIPY_REDIRECT_URI,
            scope=["user-read-playback-state", "user-modify-playback-state", "user-read-currently-playing"]
        ))

        # Spotifyで曲を検索
        result = sp.search(q=music_title, limit=1)
        items = result['tracks']['items']

        if items:
            track_id = items[0]['id']
            try:
                sp.add_to_queue(f"spotify:track:{track_id}")
            except SpotifyException as e:
                if e.args[0] == 404 and e.args[1] == -1:
                    return EnqueueReturnValue(error_codes=(ErrorCode.NO_ACTIVE_DEVICE,))
                raise e
        else:
            print(f"Could not find music '{music_title}'")
            return EnqueueReturnValue(error_codes=(ErrorCode.MUSIC_NOT_FOUND,))
        return EnqueueReturnValue(error_codes=())
