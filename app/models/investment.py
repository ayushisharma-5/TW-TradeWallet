from app.extensions import db

class Investment(db.Model):
    __tablename__ = 'investments' # table name

    id = db.Column(db.Integer, primary_key=True, autoincrement=True) # unique id
    portfolio_id = db.Column(db.Integer, nullable=False) # identifies the portfolio 1
    ticker = db.Column(db.String(20), nullable=False) # stock ticker symbol x
    price = db.Column(db.Float) # purchase price
    quantity = db.Column(db.Integer) # number of shares b
    date = db.Column(db.Date) # purchase date

    def __str__(self):
        return (f"[id: {self.id}, portfolioId: {self.portfolio_id}, "
                f"ticker: {self.ticker}, price: {self.price}, "
                f"quantity: {self.quantity}, date: {self.date}]")

    def __repr__(self):
        return self.__str__() # representation is same as string
    
    def to_dict(self):
        return {
            "id": self.id,
            "portfolio_id": self.portfolio_id,
            "ticker": self.ticker,
            "price": self.price,
            "quantity": self.quantity,
            "date": self.date.isoformat() if self.date else None
    }
