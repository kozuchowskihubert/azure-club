"""
Events API with PostgreSQL/SQLAlchemy
Supports both local development and Vercel deployment
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from jinja2 import Template

app = Flask(__name__)
CORS(app)

# Database Configuration
# Use PostgreSQL connection string from environment, fallback to SQLite for local dev
DATABASE_URL = os.environ.get('DATABASE_URL') or os.environ.get('POSTGRES_URL')
if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
    # Fix for SQLAlchemy 1.4+ (postgres:// -> postgresql://)
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL or 'sqlite:///arch1tect.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# SMTP Configuration - flexible for different email providers
# Supports: Resend, Gmail, SendGrid, Mailgun, custom SMTP
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.resend.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'True').lower() == 'true'
app.config['MAIL_USE_SSL'] = os.environ.get('MAIL_USE_SSL', 'False').lower() == 'true'
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'resend')  # For Resend SMTP
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', '')  # Resend API key
# Sender can be different from MAIL_USERNAME (e.g., arch1tect@haos.fm)
sender_email = os.environ.get('MAIL_SENDER', os.environ.get('MAIL_FROM', 'arch1tect@haos.fm'))
app.config['MAIL_DEFAULT_SENDER'] = ('ARCH1TECT | HAOS.fm', sender_email)

db = SQLAlchemy(app)
mail = Mail(app)

# Models
class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(50))
    venue = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100))
    type = db.Column(db.String(50), default='club')
    description = db.Column(db.Text)
    artists = db.Column(db.Text)
    price = db.Column(db.Float)
    capacity = db.Column(db.Integer)
    image_url = db.Column(db.Text)
    status = db.Column(db.String(50), default='upcoming')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'date': self.date,
            'time': self.time,
            'venue': self.venue,
            'city': self.city,
            'type': self.type,
            'description': self.description,
            'artists': self.artists,
            'price': self.price,
            'capacity': self.capacity,
            'image_url': self.image_url,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(50))
    event_date = db.Column(db.String(50))
    event_type = db.Column(db.String(50))
    start_time = db.Column(db.String(50))
    duration = db.Column(db.Integer)
    venue = db.Column(db.String(255))
    city = db.Column(db.String(100))
    guests = db.Column(db.Integer)
    message = db.Column(db.Text)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Calendar integration fields (like san-bud)
    calendar_event_sent = db.Column(db.Boolean, default=False)
    calendar_platforms = db.Column(db.String(255))  # "Google,Apple,Outlook,Office365"
    event_title = db.Column(db.String(255))
    event_location = db.Column(db.String(500))
    
    event = db.relationship('Event', backref='bookings')
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'event_date': self.event_date,
            'event_type': self.event_type,
            'start_time': self.start_time,
            'duration': self.duration,
            'venue': self.venue,
            'city': self.city,
            'guests': self.guests,
            'message': self.message,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'calendar_event_sent': self.calendar_event_sent,
            'calendar_platforms': self.calendar_platforms,
            'event_title': self.event_title,
            'event_location': self.event_location
        }

# Initialize database
def init_db():
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully!")

# Routes - Events
@app.route('/api/events', methods=['GET'])
def get_events():
    """Get all events"""
    try:
        events = Event.query.order_by(Event.date.desc()).all()
        return jsonify([event.to_dict() for event in events])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    """Get single event"""
    try:
        event = Event.query.get_or_404(event_id)
        return jsonify(event.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@app.route('/api/events', methods=['POST'])
def create_event():
    """Create new event"""
    try:
        data = request.get_json()
        
        event = Event(
            name=data.get('name'),
            date=data.get('date'),
            time=data.get('time'),
            venue=data.get('venue'),
            city=data.get('city'),
            type=data.get('type', 'club'),
            description=data.get('description'),
            artists=data.get('artists'),
            price=data.get('price'),
            capacity=data.get('capacity'),
            image_url=data.get('image_url'),
            status=data.get('status', 'upcoming')
        )
        
        db.session.add(event)
        db.session.commit()
        
        return jsonify(event.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    """Update event"""
    try:
        event = Event.query.get_or_404(event_id)
        data = request.get_json()
        
        # Update fields
        for key in ['name', 'date', 'time', 'venue', 'city', 'type', 'description', 
                    'artists', 'price', 'capacity', 'image_url', 'status']:
            if key in data:
                setattr(event, key, data[key])
        
        event.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(event.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    """Delete event"""
    try:
        event = Event.query.get_or_404(event_id)
        db.session.delete(event)
        db.session.commit()
        
        return jsonify({'message': 'Event deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Routes - Bookings
@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    """Get all bookings"""
    try:
        bookings = Booking.query.order_by(Booking.created_at.desc()).all()
        return jsonify([booking.to_dict() for booking in bookings])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    """Create new booking"""
    try:
        data = request.get_json()
        
        # Generate calendar event data
        event_title = f"ARCH1TECT @ {data.get('venue', 'Club HAOS')}"
        event_location = f"{data.get('venue', 'Club HAOS')}, {data.get('city', 'Gdańsk')}"
        calendar_platforms = "Google Calendar,Apple Calendar,Outlook,Office 365"
        
        booking = Booking(
            event_id=data.get('event_id'),
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone'),
            event_date=data.get('event_date'),
            event_type=data.get('event_type'),
            start_time=data.get('start_time'),
            duration=data.get('duration', 240),  # Default 4 hours for club events
            venue=data.get('venue'),
            city=data.get('city'),
            guests=data.get('guests'),
            message=data.get('message'),
            status='pending',
            calendar_event_sent=True,  # We provide calendar integration
            calendar_platforms=calendar_platforms,
            event_title=event_title,
            event_location=event_location
        )
        
        db.session.add(booking)
        db.session.commit()
        
        # Send confirmation email
        try:
            send_booking_confirmation(booking.id)
        except Exception as email_error:
            print(f"Email error: {email_error}")
        
        return jsonify(booking.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings/<int:booking_id>/approve', methods=['POST'])
def approve_booking(booking_id):
    """Approve booking"""
    try:
        booking = Booking.query.get_or_404(booking_id)
        booking.status = 'approved'
        db.session.commit()
        
        # Send approval email
        try:
            send_booking_approval(booking.id)
        except Exception as email_error:
            print(f"Email error: {email_error}")
        
        return jsonify(booking.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings/<int:booking_id>/reject', methods=['POST'])
def reject_booking(booking_id):
    """Reject booking"""
    try:
        booking = Booking.query.get_or_404(booking_id)
        booking.status = 'rejected'
        db.session.commit()
        
        return jsonify(booking.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Email functions
def send_booking_confirmation(booking_id):
    """Send booking confirmation email"""
    booking = Booking.query.get(booking_id)
    if not booking:
        return
    
    html_template = '''
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: #0a0a0a;">
        <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a0a1a 0%, #0a0a0a 100%);">
            <div style="background: linear-gradient(135deg, #ff0080 0%, #ff0080 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 32px; text-shadow: 0 0 20px rgba(255,0,255,0.5);">
                    🎧 ARCH1TECT
                </h1>
            </div>
            
            <div style="padding: 40px 30px; color: #fff;">
                <h2 style="color: #ff0080; margin-top: 0;">Potwierdzenie rezerwacji</h2>
                
                <p style="color: #ccc; line-height: 1.6;">Cześć <strong>{{ name }}</strong>!</p>
                
                <p style="color: #ccc; line-height: 1.6;">
                    Dziękujemy za rezerwację. Twoje zgłoszenie zostało przyjęte i oczekuje na potwierdzenie.
                </p>
                
                <div style="background: rgba(255,0,128,0.1); border-left: 4px solid #ff0080; padding: 20px; margin: 30px 0;">
                    <h3 style="color: #ff0080; margin-top: 0;">Szczegóły rezerwacji:</h3>
                    <table style="width: 100%; color: #ccc;">
                        <tr>
                            <td style="padding: 8px 0;"><strong>Data:</strong></td>
                            <td>{{ event_date }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0;"><strong>Godzina:</strong></td>
                            <td>{{ start_time }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0;"><strong>Miejsce:</strong></td>
                            <td>{{ venue }}, {{ city }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0;"><strong>Typ:</strong></td>
                            <td>{{ event_type }}</td>
                        </tr>
                        {% if duration %}
                        <tr>
                            <td style="padding: 8px 0;"><strong>Czas trwania:</strong></td>
                            <td>{{ duration }} godzin</td>
                        </tr>
                        {% endif %}
                    </table>
                </div>
                
                <p style="color: #ccc; line-height: 1.6;">
                    Skontaktujemy się z Tobą wkrótce, aby potwierdzić szczegóły.
                </p>
                
                <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,0,128,0.3); text-align: center;">
                    <p style="color: #888; font-size: 14px;">
                        ARCH1TECT<br>
                        Email: booking@arch1tect.pl
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    '''
    
    template = Template(html_template)
    html_content = template.render(
        name=booking.name,
        event_date=booking.event_date,
        start_time=booking.start_time,
        venue=booking.venue,
        city=booking.city,
        event_type=booking.event_type,
        duration=booking.duration
    )
    
    msg = Message(
        subject='🎉 Potwierdzenie rezerwacji - ARCH1TECT',
        recipients=[booking.email],
        html=html_content
    )
    
    mail.send(msg)

def send_booking_approval(booking_id):
    """Send booking approval email"""
    booking = Booking.query.get(booking_id)
    if not booking:
        return
    
    html_template = '''
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: #0a0a0a;">
        <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a0a1a 0%, #0a0a0a 100%);">
            <div style="background: linear-gradient(135deg, #00ff88 0%, #00ccff 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 32px;">
                    ✅ ARCH1TECT
                </h1>
            </div>
            
            <div style="padding: 40px 30px; color: #fff;">
                <h2 style="color: #00ff88; margin-top: 0;">Rezerwacja zatwierdzona!</h2>
                
                <p style="color: #ccc; line-height: 1.6;">Cześć <strong>{{ name }}</strong>!</p>
                
                <p style="color: #ccc; line-height: 1.6;">
                    Świetne wiadomości! Twoja rezerwacja została <strong style="color: #00ff88;">zatwierdzona</strong>.
                </p>
                
                <div style="background: rgba(0,255,136,0.1); border-left: 4px solid #00ff88; padding: 20px; margin: 30px 0;">
                    <h3 style="color: #00ff88; margin-top: 0;">Potwierdzone szczegóły:</h3>
                    <table style="width: 100%; color: #ccc;">
                        <tr>
                            <td style="padding: 8px 0;"><strong>Data:</strong></td>
                            <td>{{ event_date }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0;"><strong>Godzina:</strong></td>
                            <td>{{ start_time }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0;"><strong>Miejsce:</strong></td>
                            <td>{{ venue }}, {{ city }}</td>
                        </tr>
                    </table>
                </div>
                
                <p style="color: #ccc; line-height: 1.6;">
                    Do zobaczenia na evencie! 🎵
                </p>
                
                <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(0,255,136,0.3); text-align: center;">
                    <p style="color: #888; font-size: 14px;">
                        ARCH1TECT<br>
                        Email: booking@arch1tect.pl
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    '''
    
    template = Template(html_template)
    html_content = template.render(
        name=booking.name,
        event_date=booking.event_date,
        start_time=booking.start_time,
        venue=booking.venue,
        city=booking.city
    )
    
    msg = Message(
        subject='🎉 Twoja rezerwacja została zatwierdzona - ARCH1TECT',
        recipients=[booking.email],
        html=html_content
    )
    
    mail.send(msg)

# Health check
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'ARCH1TECT API is running', 'database': 'PostgreSQL'})

# Initialize database on startup
with app.app_context():
    try:
        init_db()
    except Exception as e:
        print(f"Database initialization error: {e}")

# Vercel serverless function handler
handler = app

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
