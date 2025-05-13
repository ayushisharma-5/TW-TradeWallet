from flask import Blueprint, jsonify, request
from app.services.portfolio_dao import get_portfolios_by_user, create_portfolio

portfolio_bp = Blueprint('portfolio', __name__)

@portfolio_bp.route('/get-all/<int:user_id>', methods=["GET"])
def get_portfolios_for_user(user_id):
    try:
        portfolios = get_portfolios_by_user(user_id)
        return jsonify([p.to_dict() for p in portfolios]), 200
    except Exception as e:
        return jsonify({"message": f"Failed to get portfolios for user ID {user_id}: {str(e)}"}), 500

@portfolio_bp.route('/create', methods=["POST"])
def create_new_portfolio():
    try:
        data = request.get_json()

        name = data.get('name')
        strategy = data.get('strategy')
        user_id = data.get('user_id')

        if not all([name, strategy, user_id]):
            return jsonify({"error": "Missing required fields: name, strategy, and user_id"}), 400

        create_portfolio(name, strategy, int(user_id))
        return jsonify({"message": "Portfolio created successfully"}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to create a new portfolio: {str(e)}"}), 500
