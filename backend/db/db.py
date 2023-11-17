from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from core.constants import DBConstant

db_engine = create_engine(DBConstant.DB_URL, echo=True)
db_session = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)

Base = declarative_base()


def get_db():
    with db_session() as session:
        yield session
