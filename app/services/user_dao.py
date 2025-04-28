from app.db import get_session
from app.models.user import User

def create_user(username,pwd,balance):
    #create a new user in the databse
    user = User(username=username, pwd = pwd,balance=balance)
    with get_session() as session:
        session.add(user)
        session.commit()
def password_matches(username,pwd):
    #query the database for the username and check if it matches
    print(f'Checking whether the provided username/pass matche: {username}|{pwd}')
    session = get_session()
    users = session.query(User).filter(User.username == username).all()
    if len(users) == 0 or len(users) > 1:
        return False
    user = users[0]
    return pwd == user.pwd

def get_all():
    session = get_session()
    return session.query(User).all()

def get_sctive():
    session = get_session()
    return session.query(User).filter(User.is_active == True).all()
