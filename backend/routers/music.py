from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from dependencies import get_account_id
from core.dtos.music import EnqueueReturnValue
from core.services.music import MusicService

router = APIRouter()


class PlayRequest(BaseModel):
    music_title: str = Field(..., title="楽曲のタイトル")


@router.post("/enqueue", name="キューに楽曲を追加", response_model=EnqueueReturnValue)
def play(
    request: PlayRequest,
    account_id: int = Depends(get_account_id)
) -> EnqueueReturnValue:
    # リクエスト情報取得
    music_title = request.music_title

    service = MusicService(
        account_id=account_id
    )
    return_value = service.enqueue(music_title)

    return return_value
