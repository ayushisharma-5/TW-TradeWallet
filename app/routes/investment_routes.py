from flask import Blueprint, jsonify, request
from app.services.investment_dao import get_investment_by_portfolio, sell

investment_bp = Blueprint('investment', __name__)

@investment_bp.route('/get-all/<int:portfolio_id>', methods=["GET"])
def get_all_investments_by_portfolio_id(portfolio_id):
    try:
        investments = get_investment_by_portfolio(portfolio_id)
        return jsonify([inv.to_dict() for inv in investments]), 200
    except Exception as e:
        return jsonify({"error": f"Failed to get investments: {str(e)}"}), 500


@investment_bp.route('/sell', methods=['POST'])
def sell_investment():
    try:
        sell_json = request.get_json()

        investment_id = sell_json.get('investmentId')
        qty = sell_json.get('qty')
        price = sell_json.get('price')

        if not all([investment_id, qty, price]):
            return jsonify({"message": "investmentId, qty, and price are required"}), 400

        sell(int(investment_id), int(qty), float(price))
        return jsonify({"message": "Investment sold successfully"}), 200
    except Exception as e:
        return jsonify({"message": f"Failed to sell investment: {str(e)}"}), 500
