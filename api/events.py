"""
Main API Entry Point for Vercel
Uses events_api_postgres Flask app via WSGI
"""
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

from events_api_postgres import app

# Vercel expects a callable named 'app' or 'handler'
# For WSGI applications, just export the Flask app
handler = app

# This allows the app to work both with Vercel and locally
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
