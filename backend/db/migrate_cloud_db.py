from sqlalchemy import create_engine, text
from sqlalchemy.exc import InternalError, OperationalError

from db.db import DB_USER, DB_PASSWORD, DB_HOST, DB_PORT
from core.models.auth import Base as Auth
from core.models.spotify import Base as Spotify

DB_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/?charset=utf8"
CARDJ_DB_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/CarDJ?charset=utf8"

engine = create_engine(CARDJ_DB_URL, echo=True)


def database_exists():
    try:
        engine.connect()
        return True
    except (InternalError, OperationalError) as e:
        print(e)
        print("Database does not exist")
        return False


def create_database():
    if not database_exists():
        root = create_engine(DB_URL, echo=True)
        with root.connect() as conn:
            conn.execute(text("CREATE DATABASE CarDJ"))
        print("Database created")

    Auth.metadata.create_all(bind=engine)
    Spotify.metadata.create_all(bind=engine)
    print("Tables created")


if __name__ == "__main__":
    create_database()
