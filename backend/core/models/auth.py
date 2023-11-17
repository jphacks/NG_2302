from sqlalchemy import Column, String, Integer
from db.db import Base


class Account(Base):
    __tablename__ = "account"

    id = Column(Integer, primary_key=True)
    login_id = Column(String(32), unique=True)
    login_password = Column(String(512))
    refresh_token = Column(String(512), nullable=True)
