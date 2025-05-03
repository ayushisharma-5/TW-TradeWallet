from sqlalchemy import Column, String, Integer,Float,Date
from app.db import Base

class Investment(Base):
    __tablename__ = 'Investment'

    id = Column(Integer, primary_key=True, autoincrement=True)
    portfolio_id = Column(Integer, nullable=False)
    ticker = Column(String, nullable=False)
    price = Column(Float)
    quantity = Column(Integer)
    date = Column(Date)


    def __str__(self):
        return f'[id: {self.id}, portfolioId: {self.portfolio_id},ticker: {self.ticker},price: {self.price}]'