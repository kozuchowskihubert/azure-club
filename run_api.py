"""Main application entry point for ARCH1TECT DJ Booking API."""
import os
from api import create_app, db

# Create Flask app
app = create_app(os.environ.get('FLASK_ENV', 'development'))

if __name__ == '__main__':
    with app.app_context():
        # Create database tables
        db.create_all()
        print("✅ Database tables created")
    
    # Run the app
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
