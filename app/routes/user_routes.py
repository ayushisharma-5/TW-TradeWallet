from flask import Blueprint, jsonify, request
from app.services.user_dao import get_all, create_user
from app.models.exceptions.QueryException import QueryException

user_bp = Blueprint('user', __name__)

@user_bp.route("/get-all", methods=["GET"])
def get_all_users():
    try:
        users = get_all()
        return jsonify([user.to_dict() for user in users]), 200
    except QueryException as qe:
        return jsonify({"error": str(qe)}), 500
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

@user_bp.route("/add-user", methods=["POST"])
def add_user():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        balance_input = data.get("balance")

        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        try:
            balance = float(balance_input)
        except (TypeError, ValueError):
            return jsonify({"error": "Balance must be a valid number"}), 400

        create_user(username, password, balance)
        return jsonify({"message": "User created successfully"}), 201

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500


  
#@user_bp.route("/create", methods=["POST"])  
#def create_user_route():
#    try:
#        data = request.get_json()
#        username = data.get("username")
#        password = data.get("password")
#        balance = float(data.get("balance"))

#        create_user(username, password, balance)

#        return jsonify({"message": "User created successfully"}), 201
#    except Exception as e:
#        return jsonify({"error": str(e)}), 500
