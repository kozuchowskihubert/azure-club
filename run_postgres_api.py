#!/usr/bin/env python3
"""
Run the Events API server with PostgreSQL support
"""

from api.events_api_postgres import app, init_db
import os

if __name__ == '__main__':
    print("🚀 Starting ARCH1TECT Events API Server (PostgreSQL)")
    print("=" * 60)
    
    # Check database configuration
    db_url = os.environ.get('DATABASE_URL') or os.environ.get('POSTGRES_URL')
    if db_url:
        db_type = "PostgreSQL"
        # Mask password in URL for display
        display_url = db_url.split('@')[1] if '@' in db_url else 'configured'
        print(f"📊 Database: {db_type} ({display_url})")
    else:
        print("📊 Database: SQLite (local development)")
    
    print(f"📍 Server running on: http://localhost:5001")
    print(f"🔗 API endpoints available at: http://localhost:5001/api/*")
    print("\nPress CTRL+C to stop the server\n")
    print("=" * 60)
    
    # Run server
    app.run(host='0.0.0.0', port=5001, debug=True)
