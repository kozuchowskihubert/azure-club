"""ARCH1TECT DJ Booking API - Flask Application Factory."""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_mail import Mail
import os

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
mail = Mail()


def create_app(config_name='development'):
    """Create and configure the Flask application."""
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'arch1tect-dj-secret-key-2025')
    
    # Database configuration
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        # Development - SQLite
        database_url = f"sqlite:///{os.path.join(os.path.dirname(os.path.dirname(__file__)), 'instance', 'bookings.db')}"
    
    # Fix PostgreSQL URL if needed (Azure uses postgres:// instead of postgresql://)
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Mail configuration
    app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'booking@arch1tect.pl')
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    
    # CORS configuration
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "https://lively-river-087542903.3.azurestaticapps.net",
                "http://localhost:3000",
                "http://localhost:52303",
                "http://localhost:*"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type"],
            "supports_credentials": True,
            "max_age": 3600
        }
    })
    
    # Register blueprints
    from api.routes import bookings, api as api_routes
    app.register_blueprint(bookings.bp)
    app.register_blueprint(api_routes.bp)
    
    # Health check endpoint
    @app.route('/health')
    def health():
        return {'status': 'healthy', 'service': 'ARCH1TECT Booking API'}, 200
    
    # Create instance folder if it doesn't exist
    try:
        os.makedirs(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'instance'), exist_ok=True)
    except OSError:
        pass
    
    return app
