from flask import Flask, Response
import json
from app.models.user import User

app = Flask(__name__)

@app.route("/users/get-all")
def get_all():
    users = [
        User(id=1, username='John Doe', balance=1000),
        User(id=2, username='Jane Doe', balance=1200),
        User(id=3, username='James Doe', balance=1500)
    ]
    user_dicts = [{
        "id": user.id,
        "username": user.username,
        "balance": user.balance
    } for user in users]

    pretty_json = json.dumps(user_dicts, indent=4)
    return Response(pretty_json, mimetype='application/json')
