"""
Vercel Serverless Function Handler for Events API (PostgreSQL)
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from urllib.parse import quote
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Database Configuration
database_url = os.environ.get('DATABASE_URL') or os.environ.get('POSTGRES_URL') or 'sqlite:///events.db'
if database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Email Configuration
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.resend.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USE_SSL'] = os.environ.get('MAIL_USE_SSL', 'False') == 'True'
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'resend')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', '')
app.config['MAIL_SENDER'] = os.environ.get('MAIL_SENDER', 'arch1tect@haos.fm')

db = SQLAlchemy(app)
mail = Mail(app)

# Models
class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(50))
    venue = db.Column(db.String(200))
    city = db.Column(db.String(100))
    type = db.Column(db.String(50))
    description = db.Column(db.Text)
    artists = db.Column(db.Text)
    price = db.Column(db.String(50))
    capacity = db.Column(db.Integer)
    image_url = db.Column(db.String(500))
    status = db.Column(db.String(50), default='upcoming')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'date': self.date, 'time': self.time,
            'venue': self.venue, 'city': self.city, 'type': self.type,
            'description': self.description, 'artists': self.artists,
            'price': self.price, 'capacity': self.capacity, 'image_url': self.image_url,
            'status': self.status, 'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Booking(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(50))
    event_date = db.Column(db.String(50))
    event_type = db.Column(db.String(50))
    start_time = db.Column(db.String(50))
    duration = db.Column(db.Integer, default=240)
    venue = db.Column(db.String(200))
    city = db.Column(db.String(100))
    guests = db.Column(db.Integer, default=1)
    message = db.Column(db.Text)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    calendar_event_sent = db.Column(db.Boolean, default=False)
    calendar_platforms = db.Column(db.String(500))
    event_title = db.Column(db.String(500))
    event_location = db.Column(db.String(500))
    
    def to_dict(self):
        return {
            'id': self.id, 'event_id': self.event_id, 'name': self.name,
            'email': self.email, 'phone': self.phone, 'event_date': self.event_date,
            'event_type': self.event_type, 'start_time': self.start_time,
            'duration': self.duration, 'venue': self.venue, 'city': self.city,
            'guests': self.guests, 'message': self.message, 'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'calendar_event_sent': self.calendar_event_sent,
            'calendar_platforms': self.calendar_platforms,
            'event_title': self.event_title, 'event_location': self.event_location
        }

# Create tables
with app.app_context():
    db.create_all()

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'ARCH1TECT API is running',
        'database': 'PostgreSQL' if 'postgresql' in database_url else 'SQLite'
    })

# Vercel handler
handler = app
