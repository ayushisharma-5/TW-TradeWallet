# app/__init__.py

from flask import Flask
from app.extensions import db  # or other setup code

def create_app(config_name='default'):
    app = Flask(__name__)

    # Load configuration (optional)
    # app.config.from_object('config_module.DevConfig')

    # Initialize extensions
    db.init_app(app)

    # Register blueprints or routes
    # from app.routes import main as main_bp
    # app.register_blueprint(main_bp)

    return app
