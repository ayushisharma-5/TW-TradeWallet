from sqlalchemy import Column, String, Integer, Boolean, Float
from app.db import Base

class User(Base):
    __tablename__ = 'User'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(100), unique=True, nullable=False)
    pwd = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    balance = Column(Float)

    def __str__(self):
        return f"[id: {self.id}, username: {self.username}, balance: {self.balance}]"

    def __repr__(self):
        return self.__str__()
