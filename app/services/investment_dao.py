from app.db import get_session
from app.models.investment import Investment
from app.services.portfolio_dao import get_portfolios_by_id
from app.services.user_dao import get_balance, update_balance

from datetime import date

def create_new(portfolio_id,ticker,price,quantity,date):
    #check whether user has enough funds
    portfolio = get_portfolios_by_id(portfolio_id)
    if len(portfolio) == 0:
        return None
    userId = portfolio[0].userID
    balance = get_balance(userId)
    purchase_price = price * quantity
    if balance < purchase_price:
        raise Exception('No sufficient funds')
    #create a new investmemt in the databse
    investment = Investment(portfolio_id=portfolio_id, ticker=ticker, price=price, quantity = quantity, date = date.today())
    with get_session() as session:
        session.add(investment)
        session.commit()
        update_balance(userId,balance - purchase_price) 

