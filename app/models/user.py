from sqlalchemy import Column, String, Integer, Boolean, Float
#from sqlalchemy.orm import relationship
from app.db import Base
#from app.models.portfolio import UserPortfolio
class User(Base):
    __tablename__ = 'User'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(100), unique=True,nullable=False)
    pwd = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True,nullable=False)
    balance = Column(Float)

    #portfolios = relationship('UserPortfolio',back_populates='user')