
from sqlalchemy import Column, String, Integer
from app.extensions import db

class Portfolio(db.Model):
    __tablename__ = 'portfolios'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    strategy = db.Column(db.String(100), nullable=False)
    userID = db.Column(db.Integer, nullable=False)  # You might add a ForeignKey later

    def __str__(self):
        return f"[id: {self.id}, name: {self.name}, strategy: {self.strategy}]"
