from flask import Blueprint, jsonify
from app.services.user_dao import get_all
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


@user_bp.route('/')
def empty():
    return 'hello', 200
