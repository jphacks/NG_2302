from sqlalchemy import Column, String, Integer
from db import Base


class Conversation(Base):
    __tablename__ = "conversation"

    id = Column(Integer, primary_key=True)
    account_id = Column(Integer, unique=True)
    conversation = Column(String(1024))
