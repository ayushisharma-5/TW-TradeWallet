def get_cnx_string():
    username = 'root'
    pwd = 'admin%40123'
    hostname = 'localhost'
    port = 3306
    database = 'tradewallet'

    return f'mysql+pymysql://{username}:{pwd}@{hostname}:{port}/{database}'