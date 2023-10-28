from dataclasses import dataclass
from sqlalchemy.orm import Session

from core.daos.spotify import SpotifyApiIdDao
from core.dtos.spotify import RegisterReturnValue


@dataclass(frozen=True)
class SpotifyService:
    db: Session
    spotify_api_id_dao: SpotifyApiIdDao
    account_id: int

    def register(
        self,
        spotify_client_id: str,
        spotify_client_secret: str
    ) -> RegisterReturnValue:
        spotify_api_id = self.spotify_api_id_dao.create_or_update_spotify_api_id_record(
            db=self.db,
            account_id=self.account_id,
            spotify_client_id=spotify_client_id,
            spotify_client_secret=spotify_client_secret
        )

        if spotify_api_id is None:
            raise Exception("Failed to register")
        return RegisterReturnValue(error_codes=())
