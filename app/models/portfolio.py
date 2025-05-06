# Import necessary components
from sqlalchemy import Column, String, Integer
from app.extensions import db


class Portfolio(db.Model):
    """Represents a user's investment portfolio.""" # Added class docstring

    __tablename__ = 'portfolios' # Database table name

    id = db.Column(db.Integer, primary_key = True, autoincrement=True) # Adjusted spacing
    name = db.Column(db.String(100), nullable=False)
    strategy = db.Column(db.String(100), nullable=False) # Portfolio strategy description
    userID = db.Column(db.Integer, nullable=False) # Identifier for the owning user (You might add a ForeignKey later)

    def __str__(self):
        """Returns a simplified string representation of the portfolio.""" # Added method docstring
        # Added a blank line here
        return f"[id: {self.id}, name: {self.name}, strategy: {self.strategy}]"
