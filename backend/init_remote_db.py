#!/usr/bin/env python3
"""
Initialize remote database (create tables). Use with DATABASE_URL env var pointing at the target DB.
Example:

export DATABASE_URL="postgresql://..."
source venv/bin/activate
python backend/init_remote_db.py
"""
import os
import sys

# Ensure backend package can be imported
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from app import app, db

if __name__ == '__main__':
    print('🚀 Initializing remote database...')
    with app.app_context():
        try:
            db.create_all()
            print('✅ Tables created/verified successfully.')
        except Exception as e:
            print('❌ Failed to create tables:', e)
            raise
    print('Done.')
