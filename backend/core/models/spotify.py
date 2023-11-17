from sqlalchemy import Column, String, Integer
from db.db import Base


class SpotifyApiId(Base):
    __tablename__ = "spotify_api_id"

    id = Column(Integer, primary_key=True)
    account_id = Column(Integer, unique=True)
    spotify_client_id = Column(String(32))
    spotify_client_secret = Column(String(32))
