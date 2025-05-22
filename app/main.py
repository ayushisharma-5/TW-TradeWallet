from flask import Flask
from app.config import Config
from app.extensions import db
from app.routes.user_routes import user_bp
from app.routes.portfolio_routes import portfolio_bp
from flask_cors import CORS
from app.routes.investment_routes import investment_bp

# Add this to your existing user_routes.py file
from app.services.user_dao import get_balance

@user_bp.route('/balance/<int:user_id>', methods=['GET'])
def get_user_balance(user_id):
    """Get user's available balance"""
    try:
        balance = get_balance(user_id)
        
        if balance is None:
            return jsonify({"error": "User not found"}), 404
            
        return jsonify({
            "balance": float(balance),
            "user_id": user_id
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to get user balance: {str(e)}"}), 500

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})
    app.config.from_object(Config)
    db.init_app(app)

    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(portfolio_bp, url_prefix='/portfolio')
    app.register_blueprint(investment_bp, url_prefix='/investment')

    with app.app_context():
        db.create_all()  # Only for initial setup or development

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
