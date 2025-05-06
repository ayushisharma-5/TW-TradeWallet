from app.extensions import db
from app.models.portfolio import Portfolio
from app.models.exceptions.QueryException import QueryException # Import custom exception
from typing import List


# --- Portfolio Service Functions --- #

def create_portfolio(name: str, strategy: str, user_id: int) -> None:
    """Creates a new portfolio and adds it to the database.""" # Added docstring
    try:
        # Instantiate a new Portfolio object
        portfolio = Portfolio(name=name, strategy=strategy, user_id=user_id)
        db.session.add(portfolio) # Stage the new portfolio
        db.session.commit() # Persist the portfolio to the database
    except Exception as e:
        db.session.rollback() # Roll back the session in case of error
        # Re-raise with a custom exception
        raise QueryException("Failed to create portfolio", e)


def get_portfolios_by_user(user_id: int) -> List[Portfolio]:
    """Retrieves all portfolios belonging to a specific user.""" # Added docstring
    try:
        # Query portfolios filtered by user ID
        return Portfolio.query.filter_by(user_id=user_id).all()
    except Exception as e:
        # Handle database query errors
        raise QueryException(f"Failed to retrieve portfolios for user_id={user_id}", e)


def get_portfolios_by_id(portfolio_id: int) -> List[Portfolio]:
    """Retrieves portfolios by their specific ID.""" # Added docstring
    # Note: This assumes 'id' is unique, but returns List as per original signature
    try:
        # Query portfolios filtered by portfolio ID
        return Portfolio.query.filter_by(id=portfolio_id).all()
    except Exception as e:
        # Handle database query errors
        raise QueryException(f"Failed to retrieve portfolio by id={portfolio_id}", e)
