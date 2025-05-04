from app.extensions import db
from app.models.portfolio import Portfolio
from app.models.exceptions.QueryException import QueryException
from typing import List


def create_portfolio(name: str, strategy: str, user_id: int) -> None:
    try:
        portfolio = Portfolio(name=name, strategy=strategy, user_id=user_id)
        db.session.add(portfolio)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        raise QueryException("Failed to create portfolio", e)


def get_portfolios_by_user(user_id: int) -> List[Portfolio]:
    try:
        return Portfolio.query.filter_by(user_id=user_id).all()
    except Exception as e:
        raise QueryException(f"Failed to retrieve portfolios for user_id={user_id}", e)


def get_portfolios_by_id(portfolio_id: int) -> List[Portfolio]:
    try:
        return Portfolio.query.filter_by(id=portfolio_id).all()
    except Exception as e:
        raise QueryException(f"Failed to retrieve portfolio by id={portfolio_id}", e)
