from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from db.db import get_db
from dependencies import get_account_id
from core.daos.spotify import SpotifyApiIdDao
from core.dtos.spotify import RegisterReturnValue
from core.services.spotify import SpotifyService

router = APIRouter()


class RegisterRequest(BaseModel):
    spotify_client_id: str = Field(..., title="Spotify Client Id")
    spotify_client_secret: str = Field(..., title="Spotify Client Secret")


@router.post("/register", name="Spotify Api Idを登録", response_model=RegisterReturnValue)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
    account_id: int = Depends(get_account_id)
) -> RegisterReturnValue:
    # リクエスト情報取得
    spotify_client_id = request.spotify_client_id
    spotify_client_secret = request.spotify_client_secret

    service = SpotifyService(
        db=db,
        spotify_api_id_dao=SpotifyApiIdDao(),
        account_id=account_id
    )
    return_value = service.register(
        spotify_client_id=spotify_client_id,
        spotify_client_secret=spotify_client_secret
    )

    return return_value
