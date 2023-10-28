from typing import Annotated
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from dependencies import get_user_context
from core.features.auth import UserContext
from core.dtos.music import EnqueueReturnValue
from core.services.music import MusicService

router = APIRouter()


class PlayRequest(BaseModel):
    music_title: str = Field(..., title="楽曲のタイトル")


@router.post("/enqueue", name="キューに楽曲を追加", response_model=EnqueueReturnValue)
def play(
    user_context: Annotated[UserContext, Depends(get_user_context)],
    request: PlayRequest
) -> EnqueueReturnValue:
    # リクエスト情報取得
    user_id = user_context.user_id
    music_title = request.music_title

    service = MusicService(
        user_id=user_id
    )
    return_value = service.enqueue(music_title)

    return return_value
