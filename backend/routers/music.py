from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from db import get_db
from dependencies import get_account_id
from core.daos.spotify import SpotifyApiIdDao
from core.dtos.music import (
    EnqueueReturnValue,
    EnqueueByTrackIdReturnValue,
    SearchMusicByTitleReturnValue,
    SearchMusicByArtistNameReturnValue,
    GetQueueInfoReturnValue,
    AdjustVolumeReturnValue
)
from core.services.music import MusicService

router = APIRouter()


class EnqueueRequest(BaseModel):
    music_title: str = Field(..., title="楽曲のタイトル")


class EnqueueByTrackIdRequest(BaseModel):
    track_id: str = Field(..., title="楽曲のトラックID")


class SearchMusicByTitleRequest(BaseModel):
    music_title: str = Field(..., title="楽曲のタイトル")


class SearchMusicByArtistNameRequest(BaseModel):
    artist_name: str = Field(..., title="アーティスト名")


class AdjustVolumeRequest(BaseModel):
    volume_percent: int = Field(..., title="百分率で表されるデバイスの音量")


@router.post("/enqueue", name="キューに楽曲を追加", response_model=EnqueueReturnValue)
def enqueue(
    request: EnqueueRequest,
    db: Session = Depends(get_db),
    account_id: int = Depends(get_account_id)
) -> EnqueueReturnValue:
    # リクエスト情報取得
    music_title = request.music_title

    service = MusicService(
        db=db,
        spotify_api_id_dao=SpotifyApiIdDao(),
        account_id=account_id
    )
    return_value = service.enqueue(music_title)

    return return_value


@router.post("/enqueue_by_track_id", name="TrackIDからキューに楽曲を追加", response_model=EnqueueByTrackIdReturnValue)
def enqueue_by_track_id(
    request: EnqueueByTrackIdRequest,
    db: Session = Depends(get_db),
    account_id: int = Depends(get_account_id)
) -> EnqueueByTrackIdReturnValue:
    # リクエスト情報取得
    track_id = request.track_id

    service = MusicService(
        db=db,
        spotify_api_id_dao=SpotifyApiIdDao(),
        account_id=account_id
    )
    return_value = service.enqueue_by_track_id(track_id)

    return return_value


@router.post("/search_music_by_title", name="楽曲のタイトルで検索", response_model=SearchMusicByTitleReturnValue)
def search_music_by_title(
    request: SearchMusicByTitleRequest,
    db: Session = Depends(get_db),
    account_id: int = Depends(get_account_id)
) -> SearchMusicByTitleReturnValue:
    # リクエスト情報取得
    music_title = request.music_title

    service = MusicService(
        db=db,
        spotify_api_id_dao=SpotifyApiIdDao(),
        account_id=account_id
    )
    return_value = service.search_music_by_title(music_title)

    return return_value


@router.post("/search_music_by_artist_name", name="アーティスト名で検索", response_model=SearchMusicByArtistNameReturnValue)
def search_music_by_artist_name(
    request: SearchMusicByArtistNameRequest,
    db: Session = Depends(get_db),
    account_id: int = Depends(get_account_id)
) -> SearchMusicByArtistNameReturnValue:
    # リクエスト情報取得
    artist_name = request.artist_name

    service = MusicService(
        db=db,
        spotify_api_id_dao=SpotifyApiIdDao(),
        account_id=account_id
    )
    return_value = service.search_music_by_artist_name(artist_name)

    return return_value


@router.get("/get_queue_info", name="キューの情報を取得", response_model=GetQueueInfoReturnValue)
def get_queue_info(
    db: Session = Depends(get_db),
    account_id: int = Depends(get_account_id)
) -> GetQueueInfoReturnValue:
    service = MusicService(
        db=db,
        spotify_api_id_dao=SpotifyApiIdDao(),
        account_id=account_id
    )
    return_value = service.get_queue_info()

    return return_value


@router.post("/adjust_volume", name="デバイスの音量を調整", response_model=AdjustVolumeReturnValue)
def adjust_volume(
    request: AdjustVolumeRequest,
    db: Session = Depends(get_db),
    account_id: int = Depends(get_account_id)
) -> AdjustVolumeReturnValue:
    service = MusicService(
        db=db,
        spotify_api_id_dao=SpotifyApiIdDao(),
        account_id=account_id
    )
    return_value = service.adjust_volume(
        volume_percent=request.volume_percent
    )

    return return_value
