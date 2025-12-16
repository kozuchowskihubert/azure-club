"""
Vercel Serverless Function Handler for Events API
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from api.events_api import app

# This is required for Vercel
handler = app
