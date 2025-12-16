"""
Main API Entry Point for Vercel
Imports the Flask app from events_api_postgres
"""
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

# Import the handler from events_api_postgres
from events_api_postgres import handler

# Export for Vercel
app = handler
