from dataclasses import dataclass


@dataclass(frozen=True)
class SpotifyApiId:
    id: int | None
    account_id: int
    spotify_client_id: str
    spotify_client_secret: str

    def set_spotify_api_id(
        self,
        spotify_client_id: str,
        spotify_client_secret: str
    ) -> "SpotifyApiId":
        return SpotifyApiId(
            id=self.id,
            account_id=self.account_id,
            spotify_client_id=spotify_client_id,
            spotify_client_secret=spotify_client_secret
        )
