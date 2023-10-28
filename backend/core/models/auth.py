from sqlalchemy import Column, String, Integer
from db import Base


class Account(Base):
    __tablename__ = "account"

    id = Column(Integer, primary_key=True)
    login_id = Column(String(32), unique=True)
    login_password = Column(String(256))
    refresh_token = Column(String(256), nullable=True)
    user_id = Column(Integer, nullable=True)
