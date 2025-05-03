from app.db import get_session
from app.models.investment import Investment
from app.services.portfolio_dao import get_portfolios_by_id
from app.services.user_dao import get_balance, update_balance

from datetime import date

def get_investment_by_portfolio(portfolioId):
        session = get_session()
        return session.query(Investment).filter(Investment.portfolio_id == portfolioId).all()

def get_investment(investmentId):
        with get_session() as session:
            investments = session.query(Investment).filter(Investment.id == investmentId).all()
        return investments

def harvest_investment(investmentId):
        with get_session() as session:
            investments = session.query(Investment).filter(Investment.id == investmentId).all()
            if len(investments) == 0:
                 return
            investment = investments[0]
            session.delete(investment)
            session.commit()

def update_qty(investmentId,qty):
     with get_session() as session:
        investments = session.query(Investment).filter(Investment.id == investmentId).all()
        if len(investments) == 0:
            return
        investment = investments[0]
        investment.quantity = qty
        session.commit()


from app.db import get_session
from app.models.investment import Investment
from app.services.portfolio_dao import get_portfolios_by_id
from app.services.user_dao import get_balance, update_balance

def purchase(portfolio_id, ticker, price, quantity, purchase_date):
    # Check whether user has enough funds
    portfolio = get_portfolios_by_id(portfolio_id)
    if not portfolio:
        raise Exception(f"No portfolio found with ID {portfolio_id}")
    
    user_id = portfolio[0].user_id  # Make sure this matches your column name
    balance = get_balance(user_id)
    total_cost = price * quantity

    if balance < total_cost:
        raise Exception(" Insufficient funds")

    # Create new investment
    investment = Investment(
        portfolio_id=portfolio_id,
        ticker=ticker,
        price=price,
        quantity=quantity,
        date=purchase_date  # Use passed-in date
    )

    # Commit to database and update balance
    with get_session() as session:
        session.add(investment)
        update_balance(user_id, balance - total_cost)
        session.commit()

    return f" Purchased {quantity} of {ticker} at ${price} each. New balance: ${balance - total_cost:.2f}"
 

def sell(investmentId,qty, sale_price):
    investments = get_investment(investmentId)
    if len(investments) == 0:
          raise Exception (f'No Matching investment exist for investment with ID {investmentId}')
    investment = investments[0] 
    available_qty = investment.quantity
    if qty > available_qty:
        raise Exception (f'Quantity provided on sale order ({qty}) exceeds user available quantity {available_qty}')
    if qty == available_qty:
          harvest_investment(investmentId)
    else:
        updated_qty = available_qty - qty
        update_qty(investmentId,updated_qty)
    proceeds = qty * sale_price
    portfolio = get_portfolios_by_id(investment.portfolio_id)[0]
    userId = portfolio.userID
    old_balance = get_balance(userId)
    update_balance(userId, old_balance + proceeds)
