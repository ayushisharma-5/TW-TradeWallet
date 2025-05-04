from app.extensions import db
from app.models.investment import Investment
from app.services.portfolio_dao import get_portfolios_by_id
from app.services.user_dao import get_balance, update_balance
from app.models.exceptions.QueryException import QueryException
from datetime import date


def get_investment_by_portfolio(portfolio_id):
    try:
        return Investment.query.filter_by(portfolio_id=portfolio_id).all()
    except Exception as e:
        raise QueryException("Failed to get investments by portfolio", e)


def get_investment(investment_id):
    try:
        return Investment.query.filter_by(id=investment_id).all()
    except Exception as e:
        raise QueryException("Failed to get investment", e)


def harvest_investment(investment_id):
    try:
        investment = Investment.query.filter_by(id=investment_id).first()
        if not investment:
            return
        db.session.delete(investment)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        raise QueryException("Failed to harvest investment", e)


def update_qty(investment_id, qty):
    try:
        investment = Investment.query.filter_by(id=investment_id).first()
        if not investment:
            return
        investment.quantity = qty
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        raise QueryException("Failed to update investment quantity", e)


def purchase(portfolio_id, ticker, price, quantity, purchase_date):
    try:
        portfolio = get_portfolios_by_id(portfolio_id)
        if not portfolio:
            raise Exception(f"No portfolio found with ID {portfolio_id}")
        
        user_id = portfolio[0].user_id  # Use correct attribute name from model
        balance = get_balance(user_id)
        total_cost = price * quantity

        if balance < total_cost:
            raise Exception("Insufficient funds")

        investment = Investment(
            portfolio_id=portfolio_id,
            ticker=ticker,
            price=price,
            quantity=quantity,
            date=purchase_date
        )

        db.session.add(investment)
        update_balance(user_id, balance - total_cost)
        db.session.commit()

        return f"Purchased {quantity} of {ticker} at ${price} each. New balance: ${balance - total_cost:.2f}"
    except Exception as e:
        db.session.rollback()
        raise QueryException("Failed to complete purchase", e)


def sell(investment_id, qty, sale_price):
    try:
        investments = get_investment(investment_id)
        if not investments:
            raise Exception(f"No matching investment with ID {investment_id}")

        investment = investments[0]
        available_qty = investment.quantity

        if qty > available_qty:
            raise Exception(f"Sell quantity ({qty}) exceeds available quantity ({available_qty})")

        if qty == available_qty:
            harvest_investment(investment_id)
        else:
            update_qty(investment_id, available_qty - qty)

        proceeds = qty * sale_price
        portfolio = get_portfolios_by_id(investment.portfolio_id)[0]
        user_id = portfolio.user_id  # Corrected attribute
        old_balance = get_balance(user_id)
        update_balance(user_id, old_balance + proceeds)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        raise QueryException("Failed to complete sale", e)
