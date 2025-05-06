from app.extensions import db


class User(db.Model):
    """Represents a user in the system.""" # Added Docstring
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True) # Adjusted spacing
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(100), nullable=False) # Added space
    is_active = db.Column(db.Boolean, default=True)
    balance = db.Column(db.Float, nullable=False)

    def __str__(self):
        # Added blank line
        return f"<id: {self.id}, name: {self.username}, balance: {self.balance}>"

    def to_dict(self):
        """Returns a dictionary representation of the user.""" # Added Docstring
        return {
            "id": self.id,
            "username": self.username,
            "balance": self.balance
        }
