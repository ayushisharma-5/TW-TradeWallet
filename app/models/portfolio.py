from sqlalchemy import Column, String, Integer
from app.db import Base

class Portfolio(Base):
    __tablename__ = 'Portfolio'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    name = Column(String, nullable=False)
    strategy = Column(String, nullable=False)
    userID = Column(Integer, nullable=False)

    def __str__(self):
        return f'[id: {self.id}, name: {self.name},startegy: {self.strategy}]'
