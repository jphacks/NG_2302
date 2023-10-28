from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, NoResultFound

from core.features.spotify import SpotifyApiId
from core.models.spotify import SpotifyApiId as SpotifyApiIdOrm


class SpotifyApiIdDao:
    def _build_entity(
        self,
        record: SpotifyApiIdOrm
    ) -> SpotifyApiId:
        return SpotifyApiId(
            id=record.id,
            account_id=record.account_id,
            spotify_client_id=record.spotify_client_id,
            spotify_client_secret=record.spotify_client_secret
        )

    def _get_pk_condition(
        self,
        spotify_api_id: SpotifyApiId
    ) -> dict[str, int | str | None]:
        return {"id": spotify_api_id.id}

    def _build_create_args(
        self,
        entity: SpotifyApiId
    ) -> dict[str, int | str | None]:
        return {
            "account_id": entity.account_id,
            "spotify_client_id": entity.spotify_client_id,
            "spotify_client_secret": entity.spotify_client_secret
        }

    def _build_update_args(
        self,
        entity: SpotifyApiId
    ) -> dict[str, int | str | None]:
        return {
            "account_id": entity.account_id,
            "spotify_client_id": entity.spotify_client_id,
            "spotify_client_secret": entity.spotify_client_secret
        }

    def create_spotify_api_id_record(
        self,
        db: Session,
        account_id: int,
        spotify_client_id: str,
        spotify_client_secret: str
    ) -> SpotifyApiId | None:
        spotify_api_id = SpotifyApiId(
            id=None,
            account_id=account_id,
            spotify_client_id=spotify_client_id,
            spotify_client_secret=spotify_client_secret
        )
        create_args = self._build_create_args(spotify_api_id)
        record = SpotifyApiIdOrm(**create_args)
        try:
            db.add(record)
            db.commit()
            db.refresh(record)
        except IntegrityError:
            db.rollback()
            return None
        return self._build_entity(record)

    def create_or_update_spotify_api_id_record(
        self,
        db: Session,
        account_id: int,
        spotify_client_id: str,
        spotify_client_secret: str
    ) -> SpotifyApiId | None:
        spotify_api_id = self.create_spotify_api_id_record(
            db=db,
            account_id=account_id,
            spotify_client_id=spotify_client_id,
            spotify_client_secret=spotify_client_secret
        )
        if spotify_api_id is not None:
            return spotify_api_id

        try:
            prev = db.query(SpotifyApiIdOrm).filter_by(account_id=account_id).first()
        except NoResultFound:
            raise Exception("Failed to register")
        prev.spotify_client_id = spotify_client_id
        prev.spotify_client_secret = spotify_client_secret
        db.commit()
        return prev
