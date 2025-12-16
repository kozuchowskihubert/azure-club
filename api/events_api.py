from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
import sqlite3
from datetime import datetime
import os
from jinja2 import Template

app = Flask(__name__)
CORS(app)

# SMTP Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'your-email@gmail.com')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', 'your-app-password')
app.config['MAIL_DEFAULT_SENDER'] = ('ARCH1TECT', os.environ.get('MAIL_USERNAME', 'booking@arch1tect.pl'))

mail = Mail(app)

# Database Configuration
DATABASE = 'arch1tect.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with app.app_context():
        conn = get_db()
        cursor = conn.cursor()
        
        # Events table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                date TEXT NOT NULL,
                time TEXT,
                venue TEXT NOT NULL,
                city TEXT,
                type TEXT DEFAULT 'club',
                description TEXT,
                artists TEXT,
                price REAL,
                capacity INTEGER,
                image_url TEXT,
                status TEXT DEFAULT 'upcoming',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Bookings table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_id INTEGER,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                event_date TEXT,
                event_type TEXT,
                start_time TEXT,
                duration INTEGER,
                venue TEXT,
                city TEXT,
                guests INTEGER,
                message TEXT,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (event_id) REFERENCES events (id)
            )
        ''')
        
        conn.commit()
        conn.close()

# Email Templates
BOOKING_CONFIRMATION_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #0a0a0a;
            color: #ffffff;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #1a1a1a, #0f0f0f);
            border: 2px solid #ff0080;
            border-radius: 15px;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(45deg, #ff0080, #ff3399);
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 32px;
            color: white;
        }
        .content {
            padding: 30px;
        }
        .content h2 {
            color: #ff0080;
            margin-top: 0;
        }
        .details {
            background: #0a0a0a;
            border: 1px solid #333;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            padding: 10px 0;
            border-bottom: 1px solid #333;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            flex: 1;
            color: #888;
        }
        .detail-value {
            flex: 2;
            font-weight: bold;
            color: #fff;
        }
        .footer {
            background: #0a0a0a;
            padding: 20px;
            text-align: center;
            color: #888;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(45deg, #ff0080, #ff3399);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎧 ARCH1TECT</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px;">DJ • PRODUCER • TECHNO</p>
        </div>
        <div class="content">
            <h2>✅ Potwierdzenie Rezerwacji</h2>
            <p>Cześć {{ name }}!</p>
            <p>Dziękuję za zarezerwowanie mojej obsługi DJ na Twoje wydarzenie. Poniżej znajdziesz szczegóły rezerwacji:</p>
            
            <div class="details">
                <div class="detail-row">
                    <div class="detail-label">📅 Data wydarzenia:</div>
                    <div class="detail-value">{{ event_date }}</div>
                </div>
                {% if event_name %}
                <div class="detail-row">
                    <div class="detail-label">🎉 Event:</div>
                    <div class="detail-value">{{ event_name }}</div>
                </div>
                {% endif %}
                {% if venue %}
                <div class="detail-row">
                    <div class="detail-label">📍 Miejsce:</div>
                    <div class="detail-value">{{ venue }}{% if city %}, {{ city }}{% endif %}</div>
                </div>
                {% endif %}
                {% if start_time %}
                <div class="detail-row">
                    <div class="detail-label">⏰ Godzina:</div>
                    <div class="detail-value">{{ start_time }}{% if duration %} ({{ duration }}h){% endif %}</div>
                </div>
                {% endif %}
                {% if event_type %}
                <div class="detail-row">
                    <div class="detail-label">🎪 Typ wydarzenia:</div>
                    <div class="detail-value">{{ event_type }}</div>
                </div>
                {% endif %}
            </div>

            {% if message %}
            <p><strong>Twoja wiadomość:</strong><br>{{ message }}</p>
            {% endif %}

            <p>Skontaktuję się z Tobą wkrótce, aby omówić szczegóły i finalizować rezerwację.</p>
            
            <center>
                <a href="https://azure-club.vercel.app" class="button">Odwiedź moją stronę →</a>
            </center>
        </div>
        <div class="footer">
            <p><strong>ARCH1TECT</strong><br>
            📧 booking@arch1tect.pl • 📱 +48 503 691 808</p>
            <p style="margin-top: 15px;">
                <a href="https://www.instagram.com/arch1tect_dj/" style="color: #ff0080; text-decoration: none;">Instagram</a> • 
                <a href="https://www.facebook.com/arch1tect.official" style="color: #ff0080; text-decoration: none;">Facebook</a> • 
                <a href="https://soundcloud.com/arch1tect" style="color: #ff0080; text-decoration: none;">SoundCloud</a>
            </p>
        </div>
    </div>
</body>
</html>
'''

# API Routes - Events

@app.route('/api/events', methods=['GET'])
def get_events():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM events ORDER BY date DESC')
    events = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(events)

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM events WHERE id = ?', (event_id,))
    event = cursor.fetchone()
    conn.close()
    if event:
        return jsonify(dict(event))
    return jsonify({'error': 'Event not found'}), 404

@app.route('/api/events', methods=['POST'])
def create_event():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO events (name, date, time, venue, city, type, description, 
                          artists, price, capacity, image_url, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['name'], data['date'], data.get('time'), data['venue'], 
        data.get('city'), data.get('type', 'club'), data.get('description'),
        data.get('artists'), data.get('price'), data.get('capacity'),
        data.get('image_url'), data.get('status', 'upcoming')
    ))
    
    event_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({'id': event_id, 'message': 'Event created successfully'}), 201

@app.route('/api/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE events 
        SET name=?, date=?, time=?, venue=?, city=?, type=?, description=?,
            artists=?, price=?, capacity=?, image_url=?, status=?, 
            updated_at=CURRENT_TIMESTAMP
        WHERE id=?
    ''', (
        data['name'], data['date'], data.get('time'), data['venue'],
        data.get('city'), data.get('type'), data.get('description'),
        data.get('artists'), data.get('price'), data.get('capacity'),
        data.get('image_url'), data.get('status'), event_id
    ))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Event updated successfully'})

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM events WHERE id = ?', (event_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Event deleted successfully'})

# API Routes - Bookings

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT b.*, e.name as event_name 
        FROM bookings b
        LEFT JOIN events e ON b.event_id = e.id
        ORDER BY b.created_at DESC
    ''')
    bookings = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(bookings)

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO bookings (event_id, name, email, phone, event_date, event_type,
                            start_time, duration, venue, city, guests, message, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    ''', (
        data.get('event_id'), data['name'], data['email'], data.get('phone'),
        data.get('event_date'), data.get('event_type'), data.get('start_time'),
        data.get('duration'), data.get('venue'), data.get('city'),
        data.get('guests'), data.get('message')
    ))
    
    booking_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    # Send confirmation email
    try:
        send_booking_confirmation(booking_id)
    except Exception as e:
        print(f"Error sending email: {e}")
    
    return jsonify({'id': booking_id, 'message': 'Booking created successfully'}), 201

@app.route('/api/bookings/<int:booking_id>/approve', methods=['POST'])
def approve_booking(booking_id):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE bookings SET status='approved' WHERE id=?
    ''', (booking_id,))
    
    conn.commit()
    conn.close()
    
    # Send approval email
    try:
        send_booking_approval(booking_id)
    except Exception as e:
        print(f"Error sending email: {e}")
    
    return jsonify({'message': 'Booking approved and email sent'})

@app.route('/api/bookings/<int:booking_id>/reject', methods=['POST'])
def reject_booking(booking_id):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE bookings SET status='rejected' WHERE id=?
    ''', (booking_id,))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Booking rejected'})

# Email Functions

def send_booking_confirmation(booking_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT b.*, e.name as event_name 
        FROM bookings b
        LEFT JOIN events e ON b.event_id = e.id
        WHERE b.id = ?
    ''', (booking_id,))
    booking = dict(cursor.fetchone())
    conn.close()
    
    template = Template(BOOKING_CONFIRMATION_TEMPLATE)
    html_content = template.render(
        name=booking['name'],
        event_name=booking.get('event_name'),
        event_date=booking.get('event_date'),
        venue=booking.get('venue'),
        city=booking.get('city'),
        start_time=booking.get('start_time'),
        duration=booking.get('duration'),
        event_type=booking.get('event_type'),
        message=booking.get('message')
    )
    
    msg = Message(
        subject='🎧 Potwierdzenie rezerwacji - ARCH1TECT',
        recipients=[booking['email']],
        html=html_content
    )
    
    mail.send(msg)

def send_booking_approval(booking_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT b.*, e.name as event_name 
        FROM bookings b
        LEFT JOIN events e ON b.event_id = e.id
        WHERE b.id = ?
    ''', (booking_id,))
    booking = dict(cursor.fetchone())
    conn.close()
    
    # Similar email template but with approval message
    template = Template(BOOKING_CONFIRMATION_TEMPLATE.replace(
        '✅ Potwierdzenie Rezerwacji',
        '🎉 Rezerwacja Zatwierdzona!'
    ))
    
    html_content = template.render(
        name=booking['name'],
        event_name=booking.get('event_name'),
        event_date=booking.get('event_date'),
        venue=booking.get('venue'),
        city=booking.get('city'),
        start_time=booking.get('start_time'),
        duration=booking.get('duration'),
        event_type=booking.get('event_type'),
        message=booking.get('message')
    )
    
    msg = Message(
        subject='🎉 Twoja rezerwacja została zatwierdzona - ARCH1TECT',
        recipients=[booking['email']],
        html=html_content
    )
    
    mail.send(msg)

# Health check
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'ARCH1TECT API is running'})

# Initialize database on startup
init_db()

# Vercel serverless function handler
def handler(request, context):
    """Handler for Vercel serverless functions"""
    return app(request, context)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
