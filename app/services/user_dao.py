from app.extensions import db
from app.models.user import User
from typing import List
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound
from app.models.exceptions.QueryException import QueryException


def create_user(username: str, password: str, balance: float) -> None:
    try:
        if not isinstance(balance, float):
            raise ValueError(f'Balance must be a decimal, found {balance}')
        if not username or not password:
            raise ValueError('Username and password are required.')

        user = User(username=username, pwd=password, balance=balance)
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        raise QueryException('Failed to create a new user', e)


def password_matches(username: str, password: str) -> bool:
    try:
        user = User.query.filter_by(username=username).one()
        return password == user.pwd
    except NoResultFound:
        raise Exception(f'No user found with username: {username}')
    except MultipleResultsFound:
        raise Exception(f'Multiple users found with username: {username}')
    except Exception as e:
        raise QueryException('Failed while checking username & password', e)


def get_all() -> List[User]:
    try:
        return User.query.all()
    except Exception as e:
        raise QueryException('Failed to get all users', e)


def get_active() -> List[User]:
    try:
        return User.query.filter_by(is_active=True).all()
    except Exception as e:
        raise QueryException('Failed to get active users', e)


def get_balance(user_id: int) -> float:
    try:
        if not isinstance(user_id, int):
            raise ValueError('user_id must be an integer')

        user = User.query.filter_by(id=user_id).first()
        return user.balance if user else 0.0
    except Exception as e:
        raise QueryException(f'Failed to get balance for user_id={user_id}', e)


def delete_user_by_id(user_id: int) -> bool:
    try:
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return False
        db.session.delete(user)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        raise QueryException(f'Failed to delete user_id={user_id}', e)


def update_balance(user_id: int, balance: float) -> bool:
    try:
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return False
        user.balance = balance
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        raise QueryException(f'Failed to update balance for user_id={user_id}', e)
