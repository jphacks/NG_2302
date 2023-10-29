from typing import List
from dataclasses import dataclass
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from spotipy.exceptions import SpotifyException
from sqlalchemy.orm import Session

from core.constants import SpotifyOAuthConstant, ErrorCode
from core.daos.spotify import SpotifyApiIdDao
from core.dtos.music import EnqueueReturnValue, GetQueueInfoReturnValue, AdjustVolumeReturnValue


@dataclass(frozen=True)
class MusicService:
    db: Session
    spotify_api_id_dao: SpotifyApiIdDao
    account_id: int

    def _get_spotify_instance(self, scope: List[str]) -> spotipy.Spotify | None:
        spotify_api_id = self.spotify_api_id_dao.read_record_by_account_id(
            db=self.db,
            account_id=self.account_id
        )
        if spotify_api_id is None:
            return None

        # Spotipyのセットアップ
        sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
            client_id=spotify_api_id.spotify_client_id,
            client_secret=spotify_api_id.spotify_client_secret,
            redirect_uri=SpotifyOAuthConstant.SPOTIPY_REDIRECT_URI,
            scope=scope
        ))
        return sp

    def enqueue(
        self,
        music_title: str
    ) -> EnqueueReturnValue:
        scope = ["user-read-playback-state", "user-modify-playback-state", "user-read-currently-playing"]
        sp = self._get_spotify_instance(scope)
        if sp is None:
            return EnqueueReturnValue(error_codes=(ErrorCode.SPOTIFY_NOT_REGISTERED,))

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

    def get_queue_info(self) -> GetQueueInfoReturnValue:
        scope = ["user-read-playback-state", "user-read-currently-playing"]
        sp = self._get_spotify_instance(scope)
        if sp is None:
            return GetQueueInfoReturnValue(error_codes=(ErrorCode.SPOTIFY_NOT_REGISTERED,))

        current_playback = sp.current_playback()
        if current_playback is not None and 'item' in current_playback:
            current_music_title = current_playback['item']['name']
            current_music_artist_name = current_playback['item']['album']['artists'][0]['name']
            current_music_image_url = current_playback['item']['album']['images'][0]['url']

            queue = sp.queue()
            queue_info = []

            for i, track in enumerate(queue['queue']):
                if i < 3:
                    track_info = {
                        "title": track['name'],
                        "artist_name": track['artists'][0]['name'],
                        "image_url": track['album']['images'][0]['url']
                    }
                    queue_info.append(track_info)

            while len(queue_info) < 3:
                queue_info.append({"title": None, "artist_name": None, "image_url": None})

            return GetQueueInfoReturnValue(
                error_codes=(),
                current_music_title=current_music_title,
                current_music_artist_name=current_music_artist_name,
                current_music_image_url=current_music_image_url,
                first_music_title=queue_info[0]['title'],
                first_music_artist_name=queue_info[0]['artist_name'],
                first_music_image_url=queue_info[0]['image_url'],
                second_music_title=queue_info[1]['title'],
                second_music_artist_name=queue_info[1]['artist_name'],
                second_music_image_url=queue_info[1]['image_url'],
                third_music_title=queue_info[2]['title'],
                third_music_artist_name=queue_info[2]['artist_name'],
                third_music_image_url=queue_info[2]['image_url']
            )
        raise Exception("get_queue_info failed")

    def adjust_volume(
        self,
        volume_percent: int
    ) -> AdjustVolumeReturnValue:
        scope = ["user-read-playback-state"]
        sp = self._get_spotify_instance(scope)
        if sp is None:
            return AdjustVolumeReturnValue(error_codes=(ErrorCode.SPOTIFY_NOT_REGISTERED,))

        if volume_percent < 0 or volume_percent > 100:
            return AdjustVolumeReturnValue(error_codes=(ErrorCode.VOLUME_PERCENT_OUT_OF_RANGE,))
        sp.volume(volume_percent)
        return AdjustVolumeReturnValue(error_codes=())
