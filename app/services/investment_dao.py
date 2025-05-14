from app.extensions import db
from app.models.investment import Investment
from app.services.portfolio_dao import get_portfolios_by_id
from app.services.user_dao import get_balance, update_balance
from app.models.exceptions.QueryException import QueryException
from datetime import date


def get_investment_by_portfolio(portfolio_id: int):
    try:
        if not isinstance(portfolio_id, int):
            raise ValueError(f'portfolio_id must be an integer, received: {portfolio_id}')
        return Investment.query.filter_by(portfolio_id=portfolio_id).all()
    except Exception as e:
        raise QueryException("Failed to get investments by portfolio", e)


def get_investment(investment_id: int):
    try:
        if not isinstance(investment_id, int):
            raise ValueError(f'investment_id must be an integer, received: {investment_id}')
        return Investment.query.filter_by(id=investment_id).first()
    except Exception as e:
        raise QueryException("Failed to get investment", e)


def harvest_investment(investment_id: int):
    try:
        if not isinstance(investment_id, int):
            raise ValueError(f'investment_id must be an integer, received: {investment_id}')
        investment = Investment.query.filter_by(id=investment_id).first()
        if not investment:
            return
        db.session.delete(investment)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        raise QueryException("Failed to harvest investment", e)


def update_qty(investment_id: int, qty: int):
    try:
        if not isinstance(investment_id, int):
            raise ValueError(f'investment_id must be an integer, received: {investment_id}')
        if not isinstance(qty, int):
            raise ValueError(f'Quantity must be an integer, received: {qty}')
        investment = Investment.query.filter_by(id=investment_id).first()
        if not investment:
            return
        investment.quantity = qty
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        raise QueryException("Failed to update investment quantity", e)


def purchase(portfolio_id: int, ticker: str, price: float, quantity: int, purchase_date: date):
    try:
        if not isinstance(portfolio_id, int):
            raise ValueError("portfolio_id must be an integer")
        if not isinstance(ticker, str) or not ticker:
            raise ValueError("ticker must be a non-empty string")
        if not isinstance(price, (float, int)) or price <= 0:
            raise ValueError("price must be a positive number")
        if not isinstance(quantity, int) or quantity <= 0:
            raise ValueError("quantity must be a positive integer")
        if not isinstance(purchase_date, date):
            raise ValueError("purchase_date must be a valid date")

        portfolios = get_portfolios_by_id(portfolio_id)
        if not portfolios:
            raise Exception(f"No portfolio found with ID {portfolio_id}")
        portfolio = portfolios[0]  # Take the first portfolio from the list
        user_id = portfolio.user_id
        balance = get_balance(user_id)
        total_cost: float = price * quantity

        if balance < total_cost:
            raise Exception("Insufficient funds")

        investment = Investment(
            portfolio_id=portfolio_id,
            ticker=ticker,
            price=price,
            quantity=quantity,
            date=date.today()
        )

        db.session.add(investment)
        update_balance(user_id, balance - total_cost)
        db.session.commit()

        return f"Purchased {quantity} of {ticker} at ${price:.2f} each. New balance: ${balance - total_cost:.2f}"
    except Exception as e:
        db.session.rollback()
        raise QueryException("Failed to complete purchase", e)


def sell(investment_id: int, qty: int, sale_price: float):
    try:
        if not isinstance(investment_id, int):
            raise ValueError("investment_id must be an integer")
        if not isinstance(qty, int) or qty <= 0:
            raise ValueError("qty must be a positive integer")
        if not isinstance(sale_price, (float, int)) or sale_price <= 0:
            raise ValueError("sale_price must be a positive number")

        investment = get_investment(investment_id)
        if not investment:
            raise Exception(f"No matching investment with ID {investment_id}")

        available_qty = investment.quantity
        if qty > available_qty:
            raise Exception(f"Sell quantity ({qty}) exceeds available quantity ({available_qty})")

        if qty == available_qty:
            harvest_investment(investment_id)
        else:
            update_qty(investment_id, available_qty - qty)

        proceeds = qty * sale_price
        portfolios = get_portfolios_by_id(investment.portfolio_id)
        if not portfolios:
            raise Exception(f"No portfolio found with ID {investment.portfolio_id}")
        
        portfolio = portfolios[0]  # Take the first one
        user_id = portfolio.user_id

        old_balance = get_balance(user_id)
        update_balance(user_id, old_balance + proceeds)
        db.session.commit()
    
    except Exception as e:
        db.session.rollback()
        raise QueryException("Failed to complete sale", e)
