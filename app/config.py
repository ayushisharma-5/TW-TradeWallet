#def get_cnx_string():
#    username = 'root'
#   pwd = 'admin%40123'
#    hostname = 'localhost'
#    port = 3306
#    database = 'tradewallet'
#    return f'mysql+pymysql://{username}:{pwd}@{hostname}:{port}/{database}'

class Config:
    username = 'root'
    pwd = 'admin%40123'
    hostname = 'localhost'
    port = 3306
    database = 'tradewallet'  
    SQLALCHEMY_DATABASE_URI=f'mysql+pymysql://{username}:{pwd}@{hostname}:{port}/{database}'
    SQLALCHEMY_TRACK_NOTOFOCATION=False
    SQLALCHEMY_RECORD_QUERIES=True