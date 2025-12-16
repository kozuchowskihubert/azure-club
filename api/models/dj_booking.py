"""DJBooking model for DJ event bookings."""
from datetime import datetime
from api import db


class DJBooking(db.Model):
    """DJ Booking model for event scheduling."""
    
    __tablename__ = 'dj_bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('event_services.id'), nullable=False)
    
    # Event details
    event_date = db.Column(db.Date, nullable=False)
    event_time = db.Column(db.Time, nullable=False)
    event_duration_hours = db.Column(db.Integer, default=4)  # Default 4 hours
    event_type = db.Column(db.String(50), nullable=False)  # club, festival, private, corporate
    venue_name = db.Column(db.String(200), nullable=False)
    venue_address = db.Column(db.String(300))
    venue_city = db.Column(db.String(100))
    
    # Booking details
    status = db.Column(db.String(50), default='pending')  # pending, confirmed, completed, cancelled
    guest_count = db.Column(db.Integer)  # Expected attendees
    special_requests = db.Column(db.Text)  # Equipment, music style preferences, etc.
    budget = db.Column(db.Numeric(10, 2))  # Optional budget indication
    notes = db.Column(db.Text)  # Internal notes
    
    # Contact preferences
    preferred_contact_method = db.Column(db.String(20), default='email')  # email, phone, both
    
    # Notification tracking
    confirmation_sent = db.Column(db.Boolean, default=False)
    reminder_sent = db.Column(db.Boolean, default=False)
    
    # Calendar integration
    calendar_event_sent = db.Column(db.Boolean, default=False)
    calendar_platforms = db.Column(db.String(255))  # Comma-separated
    event_title = db.Column(db.String(255))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    confirmed_at = db.Column(db.DateTime)
    
    def __repr__(self):
        return f'<DJBooking {self.id} - {self.status}>'
    
    def to_dict(self):
        """Convert booking to dictionary."""
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'service_id': self.service_id,
            'event_date': self.event_date.isoformat() if self.event_date else None,
            'event_time': self.event_time.isoformat() if self.event_time else None,
            'event_duration_hours': self.event_duration_hours,
            'event_type': self.event_type,
            'venue_name': self.venue_name,
            'venue_address': self.venue_address,
            'venue_city': self.venue_city,
            'status': self.status,
            'guest_count': self.guest_count,
            'special_requests': self.special_requests,
            'budget': float(self.budget) if self.budget else None,
            'notes': self.notes,
            'preferred_contact_method': self.preferred_contact_method,
            'confirmation_sent': self.confirmation_sent,
            'reminder_sent': self.reminder_sent,
            'calendar_event_sent': self.calendar_event_sent,
            'calendar_platforms': self.calendar_platforms.split(',') if self.calendar_platforms else [],
            'event_title': self.event_title,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'confirmed_at': self.confirmed_at.isoformat() if self.confirmed_at else None
        }
