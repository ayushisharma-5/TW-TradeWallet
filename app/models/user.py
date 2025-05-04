from app.extensions import db

class User(db.Model):
    __tablename__ = 'user'  # lowercase + plural is the convention

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    balance = db.Column(db.Float, nullable=False)

    def __str__(self):
        return f"<id: {self.id}, name: {self.username}, balance: {self.balance}>"

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "balance": self.balance
        }
