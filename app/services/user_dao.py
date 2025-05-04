from app.db import get_session
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

        with get_session() as session:
            session.add(user)
            session.commit()

    except Exception as e:
        raise QueryException('Failed to create a new user', e)


def password_matches(username: str, password: str) -> bool:
    try:
        with get_session() as session:
            user = session.query(User).filter(User.username == username).one()
            return password == user.pwd

    except NoResultFound:
        raise Exception(f'No user found with username: {username}')
    except MultipleResultsFound:
        raise Exception(f'Multiple users found with username: {username}')
    except Exception as e:
        raise QueryException('Failed while checking username & password', e)


def get_all() -> List[User]:
    try:
        with get_session() as session:
            return session.query(User).all()
    except Exception as e:
        raise QueryException('Failed to get all users', e)


def get_active() -> List[User]:
    try:
        with get_session() as session:
            return session.query(User).filter(User.is_active == True).all()
    except Exception as e:
        raise QueryException('Failed to get active users', e)


def get_balance(user_id: int) -> float:
    try:
        with get_session() as session:
            user = session.query(User).filter(User.id == user_id).first()
            return user.balance if user else 0.0
    except Exception as e:
        raise QueryException(f'Failed to get balance for user_id={user_id}', e)


def delete_user_by_id(user_id: int) -> bool:
    try:
        with get_session() as session:
            user = session.query(User).filter(User.id == user_id).first()
            if not user:
                return False
            session.delete(user)
            session.commit()
            return True
    except Exception as e:
        raise QueryException(f'Failed to delete user_id={user_id}', e)


def update_balance(user_id: int, balance: float) -> bool:
    try:
        with get_session() as session:
            user = session.query(User).filter(User.id == user_id).first()
            if not user:
                return False
            user.balance = balance
            session.commit()
            return True
    except Exception as e:
        raise QueryException(f'Failed to update balance for user_id={user_id}', e)
