from app.services.investment_dao import create_new
#from app.services.user_dao import update_balance

from datetime import date

create_new(3,'AAPL',10,10,date.today())