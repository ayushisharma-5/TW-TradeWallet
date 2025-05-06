from app.extensions import db

class Investment(db.Model):
    __tablename__ = 'investments'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    portfolio_id = db.Column(db.Integer, nullable=False)
    ticker = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Float)
    quantity = db.Column(db.Integer)
    date = db.Column(db.Date)

    def __str__(self):
        return (f"[id: {self.id}, portfolioId: {self.portfolio_id}, "
                f"ticker: {self.ticker}, price: {self.price}, "
                f"quantity: {self.quantity}, date: {self.date}]")

    def __repr__(self):
        return self.__str__()
