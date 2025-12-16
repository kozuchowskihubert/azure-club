"""Notification model for tracking communications."""
from datetime import datetime
from api import db


class Notification(db.Model):
    """Notification model for email/SMS tracking."""
    
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('dj_bookings.id'))
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))
    
    # Notification details
    notification_type = db.Column(db.String(50), nullable=False)  # booking_confirmation, reminder, cancellation, update
    channel = db.Column(db.String(20), nullable=False)  # email, sms, both
    recipient_email = db.Column(db.String(120))
    recipient_phone = db.Column(db.String(20))
    
    # Content
    subject = db.Column(db.String(200))
    message = db.Column(db.Text)
    
    # Status
    status = db.Column(db.String(20), default='pending')  # pending, sent, failed
    sent_at = db.Column(db.DateTime)
    error_message = db.Column(db.Text)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Notification {self.id} - {self.notification_type}>'
    
    def to_dict(self):
        """Convert notification to dictionary."""
        return {
            'id': self.id,
            'booking_id': self.booking_id,
            'customer_id': self.customer_id,
            'notification_type': self.notification_type,
            'channel': self.channel,
            'recipient_email': self.recipient_email,
            'recipient_phone': self.recipient_phone,
            'subject': self.subject,
            'status': self.status,
            'sent_at': self.sent_at.isoformat() if self.sent_at else None,
            'error_message': self.error_message,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
