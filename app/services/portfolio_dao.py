from app.db import get_session
from app.models.portfolio import Portfolio

def create_new(name,strategy,userID):
    #create a new portfolio in the databse
    portfolio = Portfolio(name=name, strategy=strategy, userID=userID)
    with get_session() as session:
        session.add(portfolio)
        session.commit()

def get_portfolios_by_user(userID):
    return get_session().query(Portfolio).filter(Portfolio.userID == userID).all()

def get_portfolios_by_id(id):
    return get_session().query(Portfolio).filter(Portfolio.id == id).all()