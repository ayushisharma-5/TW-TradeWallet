#def get_cnx_string():
#    username = 'root'
#   pwd = 'admin%40123'
#    hostname = 'localhost'
#    port = 3306
#    database = 'tradewallet'
#    return f'mysql+pymysql://{username}:{pwd}@{hostname}:{port}/{database}'

class Config:
    username = 'admin'
    pwd = 'Admin12345'
    hostname = 'localhost'
    port = 3306
    database = 'tradewallet'  
    #SQLALCHEMY_DATABASE_URI=f'mysql+pymysql://{username}:{pwd}@{hostname}:{port}/{database}'
    #SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://{username}:{pwd}@tradewallet-db.ct0qoqams0zf.us-east-2.rds.amazonaws.com:{port}/{database}'
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://admin:Admin12345@tradewallet-db.ct0qoqams0zf.us-east-2.rds.amazonaws.com:3306/tradewallet'

    SQLALCHEMY_TRACK_NOTOFOCATION=False
    SQLALCHEMY_RECORD_QUERIES=True