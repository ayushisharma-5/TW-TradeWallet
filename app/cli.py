from datetime import date
from termcolor import colored
from app.services.user_dao import get_all, create_user, delete_user_by_id
from app.services.portfolio_dao import get_portfolios_by_user, create_portfolio
from app.services.investment_dao import get_investment_by_portfolio, purchase, sell


def print_main_menu():
    return colored('''
Welcome to Trade Wallet
----------------------------
MAIN MENU
----------------------------
1. Users Menu
2. Portfolio Menu
3. Market
0. Exit
>> ''', 'cyan')


def print_user_menu():
    return colored('''
----------------------------
USER MENU
----------------------------
1. View All Users
2. Add User
3. Delete User
0. Return to Main Menu
>> ''', 'cyan')


def print_portfolio_menu():
    return colored('''
----------------------------
PORTFOLIO MENU
----------------------------
1. View portfolio by Users
2. Add Portfolio
0. Return to Main Menu
>> ''', 'cyan')


def print_market_menu():
    return colored('''
----------------------------
MARKET MENU
----------------------------
1. View investment by portfolio
2. Purchase
3. Sell
0. Return to Main Menu
>> ''', 'cyan')


def user_prompt():
    while True:
        user_input = input(print_user_menu())
        if user_input == '1':
            users = get_all()
            if users:
                print(colored("\n--- User List ---", "green"))
                for user in users:
                    print(colored(str(user), "red"))
            else:
                print(colored("No users found.", "red"))
        elif user_input == '2':
            username_input = input(colored('Username: ', 'yellow'))
            password_input = input(colored('Password: ', 'yellow'))
            balance_input = input(colored('Balance: ', 'yellow'))
            try:
                balance = float(balance_input)
                create_user(username_input, password_input, balance)
                print(colored("User added successfully.", "green"))
            except ValueError:
                print(colored("Invalid balance. Must be a number.", "red"))
        elif user_input == '3':
            userid_input = input(colored('Enter user ID to delete: ', 'yellow'))
            try:
                user_id = int(userid_input)
                confirm = input(colored(f'Delete user with ID {user_id}? (y/n): ', 'red'))
                if confirm.lower() == 'y':
                    success = delete_user_by_id(user_id)
                    if success:
                        print(colored("User deleted successfully.", "green"))
                    else:
                        print(colored("User not found.", "red"))
                else:
                    print(colored("Deletion cancelled.", "cyan"))
            except ValueError:
                print(colored("Invalid ID. Must be a number.", "red"))
        elif user_input == '0':
            break
        else:
            print(colored("Invalid input. Try again.", "red"))


def portfolio_prompt():
    while True:
        user_input = input(print_portfolio_menu())
        if user_input == '1':
            userid_input = input('User ID: ')
            try:
                userid = int(userid_input)
                portfolios = get_portfolios_by_user(userid)
                if portfolios:
                    print(colored(f"\n--- Portfolios for User ID {userid} ---", 'green'))
                    for portfolio in portfolios:
                        print(colored(str(portfolio), 'blue'))
                else:
                    print(colored("No portfolios found for this user.", 'red'))
            except Exception as e:
                print(colored(f'Failed to get portfolios: {e}', 'red'))
        elif user_input == '2':
            userid_input = input('User ID: ')
            name_input = input('Portfolio Name: ')
            strategy_input = input('Portfolio Strategy: ')
            try:
                userid = int(userid_input)
                create_portfolio(userid, name_input, strategy_input)
                print(colored('Portfolio created successfully', 'green'))
            except Exception as e:
                print(colored(f'Failed to create portfolio: {e}', 'red'))
        elif user_input == '0':
            break
        else:
            print(colored("Invalid input. Try again.", "red"))


def market_prompt():
    while True:
        user_input = input(print_market_menu())
        if user_input == '1':
            portfolioid_input = input('Portfolio ID: ')
            try:
                portfolioid = int(portfolioid_input)
                investments = get_investment_by_portfolio(portfolioid)
                if not investments:
                    print(colored('No investments in this portfolio.', 'blue'))
                for investment in investments:
                    print(colored(str(investment), 'blue'))
            except Exception as e:
                print(colored(f'Failed to get investments: {e}', 'red'))
        elif user_input == '2':
            try:
                portid = int(input('Portfolio ID: '))
                ticker = input('Ticker: ')
                price = float(input('Price: '))
                qty = float(input('Quantity: '))
                result = purchase(portid, ticker, price, qty, date.today())
                print(colored(result, 'green'))
            except Exception as e:
                print(colored(f'Could not complete purchase: {e}', 'red'))
        elif user_input == '3':
            try:
                portid = int(input('Portfolio ID: '))
                ticker = input('Ticker to sell: ')
                price = float(input('Sell price: '))
                qty = float(input('Quantity to sell: '))
                sell(portid, ticker, price, qty, date.today())
                print(colored('Sale completed successfully.', 'green'))
            except Exception as e:
                print(colored(f'Could not complete sell: {e}', 'red'))
        elif user_input == '0':
            break
        else:
            print(colored("Invalid input. Try again.", "red"))

def run():
    while True:
        user_input = input(print_main_menu())
        if user_input == '1':
            user_prompt()
        elif user_input == '2':
            portfolio_prompt()
        elif user_input == '3':
            market_prompt()
        elif user_input == '0':
            print(colored("Exiting Trade Wallet. Goodbye!", "cyan"))
            break
        else:
            print(colored("Invalid input. Try again.", "red"))