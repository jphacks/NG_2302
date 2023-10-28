from sqlalchemy import create_engine

from core.constants import DBConstant
from core.models.auth import Base as Auth

engine = create_engine(DBConstant.DB_URL, echo=True)


def reset_database():
    Auth.metadata.drop_all(bind=engine)
    Auth.metadata.create_all(bind=engine)


if __name__ == "__main__":
    reset_database()
