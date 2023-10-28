from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from spotipy import Spotify
from core.spotify.auth import get_auth_url
from core.spotify.music import start_playback

router = APIRouter()


class PlayRequest(BaseModel):
    music_title: str = Field(..., title="楽曲のタイトル")


@router.post("/play")
def play(
    request: PlayRequest,
    sp: Spotify = Depends(get_auth_url)
):
    return start_playback(sp, request.music_title)
