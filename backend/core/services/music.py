import random
from typing import List
from dataclasses import dataclass
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from spotipy.exceptions import SpotifyException
from sqlalchemy.orm import Session

from core.constants import (
    SpotifyOAuthConstant,
    SentimentAnalysisConstant,
    ErrorCode
)
from core.functions.sentiment_analysis import SentimentAnalysis
from core.daos.spotify import SpotifyApiIdDao
from core.dtos.music import (
    EnqueueReturnValue,
    EnqueueByTrackIdReturnValue,
    EnqueueBasedOnMoodReturnValue,
    SearchMusicByTitleReturnValue,
    SearchMusicByArtistNameReturnValue,
    GetQueueInfoReturnValue,
    AdjustVolumeReturnValue
)


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

    def _get_queue_list(self, sp: spotipy.Spotify) -> list[dict[str, str]]:
        queue = sp.queue()
        queue_list = []

        for i, track in enumerate(queue['queue']):
            if i < 3:
                track_info = {
                    "title": track['name'],
                    "artist_name": track['artists'][0]['name'],
                    "image_url": track['album']['images'][0]['url']
                }
                queue_list.append(track_info)

        while len(queue_list) < 3:
            queue_list.append({"title": None, "artist_name": None, "image_url": None})

        return queue_list

    def _is_duplicated_music_in_queue(self, sp: spotipy.Spotify, track_id: str) -> bool:
        current_playback = sp.current_playback()
        if current_playback['item']['id'] == track_id:
            return True

        queue = sp.queue()
        for i, track in enumerate(queue['queue']):
            if i < 3:
                if track['id'] == track_id:
                    return True

        return False

    def _is_queue_size_below_threshold(self, sp: spotipy.Spotify) -> bool:
        # サービスから入れた曲が重複することはないため、キュー内の楽曲が重複している場合はSpotifyが自動で補完した楽曲が存在する
        queue_list = self._get_queue_list(sp)

        seen_elements = set()

        for element in queue_list:
            element_tuple = tuple(element.items())
            if element_tuple in seen_elements:
                return True
            seen_elements.add(element_tuple)

        return False

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
            if self._is_duplicated_music_in_queue(sp, track_id):
                return EnqueueReturnValue(error_codes=(ErrorCode.MUSIC_ALREADY_IN_QUEUE,))

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

    def enqueue_by_track_id(
        self,
        track_id: str
    ) -> EnqueueByTrackIdReturnValue:
        scope = ["user-read-playback-state", "user-modify-playback-state", "user-read-currently-playing"]
        sp = self._get_spotify_instance(scope)
        if sp is None:
            return EnqueueByTrackIdReturnValue(error_codes=(ErrorCode.SPOTIFY_NOT_REGISTERED,))
        if self._is_duplicated_music_in_queue(sp, track_id):
            return EnqueueByTrackIdReturnValue(error_codes=(ErrorCode.MUSIC_ALREADY_IN_QUEUE,))

        try:
            sp.add_to_queue(f"spotify:track:{track_id}")
        except SpotifyException as e:
            if e.args[0] == 404 and e.args[1] == -1:
                return EnqueueByTrackIdReturnValue(error_codes=(ErrorCode.NO_ACTIVE_DEVICE,))
            raise e
        return EnqueueByTrackIdReturnValue(error_codes=())

    def enqueue_based_on_mood(
        self,
        conversation: str
    ) -> EnqueueBasedOnMoodReturnValue:
        sentiment_analysis = SentimentAnalysis(
            credentials_path=SentimentAnalysisConstant.CREDENTIALS_PATH
        )
        score, magnitude = sentiment_analysis.analyze(conversation)
        score = score * SentimentAnalysisConstant.SCORE_COEFFICIENT
        magnitude = magnitude * SentimentAnalysisConstant.MAGNITUDE_COEFFICIENT
        mood = 1 + score * (1 / magnitude + 1)

        scope = ["user-read-playback-state", "user-modify-playback-state", "user-read-currently-playing"]
        sp = self._get_spotify_instance(scope)
        if sp is None:
            return EnqueueBasedOnMoodReturnValue(error_codes=(ErrorCode.SPOTIFY_NOT_REGISTERED,))
        if not self._is_queue_size_below_threshold(sp):
            return EnqueueBasedOnMoodReturnValue(error_codes=(ErrorCode.QUEUE_SIZE_ABOVE_THRESHOLD,))

        current_track_uri = sp.current_playback()['item']['uri']
        audio_features = sp.audio_features(current_track_uri)[0]
        current_valence = audio_features['valence']
        current_energy = audio_features['energy']

        recommendations = sp.recommendations(
            seed_tracks=[current_track_uri],
            target_valence=current_valence * mood,
            target_energy=current_energy * mood
        )

        if not recommendations['tracks']:
            return EnqueueBasedOnMoodReturnValue(error_codes=(ErrorCode.MUSIC_NOT_FOUND,))
        filtered_tracks = [
            track for track in recommendations['tracks']
            if not self._is_duplicated_music_in_queue(sp, track['id'])
        ]
        if not filtered_tracks:
            return EnqueueBasedOnMoodReturnValue(error_codes=(ErrorCode.MUSIC_ALREADY_IN_QUEUE,))
        # 検索結果からランダムに1曲選択
        selected_track = random.choice(filtered_tracks)
        track_uri = selected_track['uri']

        # キューに曲を追加
        sp.add_to_queue(track_uri)

        return EnqueueBasedOnMoodReturnValue(error_codes=())

    def search_music_by_title(
        self,
        music_title: str
    ) -> SearchMusicByTitleReturnValue:
        scope = []
        sp = self._get_spotify_instance(scope)
        if sp is None:
            return SearchMusicByTitleReturnValue(error_codes=(ErrorCode.SPOTIFY_NOT_REGISTERED,))

        # Spotifyで曲を検索
        result = sp.search(q=music_title, limit=5)
        items = result['tracks']['items']

        if len(items) < 5:
            return SearchMusicByTitleReturnValue(error_codes=(ErrorCode.MUSIC_NOT_FOUND,))

        tracks = []

        for i in range(5):
            track_info = {
                "track_id": items[i]['id'],
                "title": items[i]['name'],
                "artist_name": items[i]['album']['artists'][0]['name'],
                "image_url": items[i]['album']['images'][0]['url']
            }
            tracks.append(track_info)

        return SearchMusicByTitleReturnValue(
            error_codes=(),
            first_music_track_id=tracks[0]['track_id'],
            first_music_title=tracks[0]['title'],
            first_music_artist_name=tracks[0]['artist_name'],
            first_music_image_url=tracks[0]['image_url'],
            second_music_track_id=tracks[1]['track_id'],
            second_music_title=tracks[1]['title'],
            second_music_artist_name=tracks[1]['artist_name'],
            second_music_image_url=tracks[1]['image_url'],
            third_music_track_id=tracks[2]['track_id'],
            third_music_title=tracks[2]['title'],
            third_music_artist_name=tracks[2]['artist_name'],
            third_music_image_url=tracks[2]['image_url'],
            fourth_music_track_id=tracks[3]['track_id'],
            fourth_music_title=tracks[3]['title'],
            fourth_music_artist_name=tracks[3]['artist_name'],
            fourth_music_image_url=tracks[3]['image_url'],
            fifth_music_track_id=tracks[4]['track_id'],
            fifth_music_title=tracks[4]['title'],
            fifth_music_artist_name=tracks[4]['artist_name'],
            fifth_music_image_url=tracks[4]['image_url']
        )

    def search_music_by_artist_name(
        self,
        artist_name: str
    ) -> SearchMusicByArtistNameReturnValue:
        scope = []
        sp = self._get_spotify_instance(scope)
        if sp is None:
            return SearchMusicByArtistNameReturnValue(error_codes=(ErrorCode.SPOTIFY_NOT_REGISTERED,))

        # Spotifyでアーティストを検索
        result = sp.search(q="artist:" + artist_name, type="artist")
        artist_id = result['artists']['items'][0]['id']

        # Spotifyで曲を検索
        items = sp.artist_top_tracks(artist_id)["tracks"]

        if len(items) < 5:
            return SearchMusicByArtistNameReturnValue(error_codes=(ErrorCode.MUSIC_NOT_FOUND,))

        tracks = []

        for i in range(5):
            track_info = {
                "track_id": items[i]['id'],
                "title": items[i]['name'],
                "artist_name": items[i]['album']['artists'][0]['name'],
                "image_url": items[i]['album']['images'][0]['url']
            }
            tracks.append(track_info)

        return SearchMusicByArtistNameReturnValue(
            error_codes=(),
            first_music_track_id=tracks[0]['track_id'],
            first_music_title=tracks[0]['title'],
            first_music_artist_name=tracks[0]['artist_name'],
            first_music_image_url=tracks[0]['image_url'],
            second_music_track_id=tracks[1]['track_id'],
            second_music_title=tracks[1]['title'],
            second_music_artist_name=tracks[1]['artist_name'],
            second_music_image_url=tracks[1]['image_url'],
            third_music_track_id=tracks[2]['track_id'],
            third_music_title=tracks[2]['title'],
            third_music_artist_name=tracks[2]['artist_name'],
            third_music_image_url=tracks[2]['image_url'],
            fourth_music_track_id=tracks[3]['track_id'],
            fourth_music_title=tracks[3]['title'],
            fourth_music_artist_name=tracks[3]['artist_name'],
            fourth_music_image_url=tracks[3]['image_url'],
            fifth_music_track_id=tracks[4]['track_id'],
            fifth_music_title=tracks[4]['title'],
            fifth_music_artist_name=tracks[4]['artist_name'],
            fifth_music_image_url=tracks[4]['image_url']
        )

    def get_queue_info(self) -> GetQueueInfoReturnValue:
        scope = ["user-read-playback-state", "user-read-currently-playing"]
        sp = self._get_spotify_instance(scope)
        if sp is None:
            return GetQueueInfoReturnValue(error_codes=(ErrorCode.SPOTIFY_NOT_REGISTERED,))

        current_playback = sp.current_playback()
        if current_playback is not None and 'item' in current_playback:
            # 楽曲の全体の時間と現在の再生位置を取得
            duration_ms = current_playback['item']['duration_ms']
            progress_ms = current_playback['progress_ms']

            current_music_duration = (duration_ms - progress_ms) // 1000

            current_music_title = current_playback['item']['name']
            current_music_artist_name = current_playback['item']['album']['artists'][0]['name']
            current_music_image_url = current_playback['item']['album']['images'][0]['url']

            queue_list = self._get_queue_list(sp)

            return GetQueueInfoReturnValue(
                error_codes=(),
                current_music_duration=current_music_duration,
                current_music_title=current_music_title,
                current_music_artist_name=current_music_artist_name,
                current_music_image_url=current_music_image_url,
                first_music_title=queue_list[0]['title'],
                first_music_artist_name=queue_list[0]['artist_name'],
                first_music_image_url=queue_list[0]['image_url'],
                second_music_title=queue_list[1]['title'],
                second_music_artist_name=queue_list[1]['artist_name'],
                second_music_image_url=queue_list[1]['image_url'],
                third_music_title=queue_list[2]['title'],
                third_music_artist_name=queue_list[2]['artist_name'],
                third_music_image_url=queue_list[2]['image_url']
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
