#!/usr/bin/env python3
"""
Run the Events API server locally for testing
"""

from api.events_api import app, init_db

if __name__ == '__main__':
    print("🚀 Starting ARCH1TECT Events API Server...")
    print("📍 Server running on: http://localhost:5001")
    print("🔗 API endpoints available at: http://localhost:5001/api/*")
    print("\nPress CTRL+C to stop the server\n")
    
    # Initialize database
    init_db()
    
    # Run server
    app.run(host='0.0.0.0', port=5001, debug=True)
