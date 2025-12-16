"""EventService model for DJ services."""
from datetime import datetime
from api import db


class EventService(db.Model):
    """Event service model for different DJ packages."""
    
    __tablename__ = 'event_services'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    service_type = db.Column(db.String(50), nullable=False)  # dj_set_club, dj_set_festival, production, etc.
    
    # Pricing
    base_price = db.Column(db.Numeric(10, 2))  # Base price (negotiable)
    price_per_hour = db.Column(db.Numeric(10, 2))  # Optional hourly rate
    min_hours = db.Column(db.Integer, default=2)
    max_hours = db.Column(db.Integer, default=8)
    
    # Availability
    is_active = db.Column(db.Boolean, default=True)
    requires_consultation = db.Column(db.Boolean, default=False)  # For custom services
    
    # Features
    includes_equipment = db.Column(db.Boolean, default=True)
    includes_lighting = db.Column(db.Boolean, default=False)
    includes_mc_services = db.Column(db.Boolean, default=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    bookings = db.relationship('DJBooking', backref='service', lazy=True)
    
    def __repr__(self):
        return f'<EventService {self.name}>'
    
    def to_dict(self):
        """Convert service to dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'service_type': self.service_type,
            'base_price': float(self.base_price) if self.base_price else None,
            'price_per_hour': float(self.price_per_hour) if self.price_per_hour else None,
            'min_hours': self.min_hours,
            'max_hours': self.max_hours,
            'is_active': self.is_active,
            'requires_consultation': self.requires_consultation,
            'includes_equipment': self.includes_equipment,
            'includes_lighting': self.includes_lighting,
            'includes_mc_services': self.includes_mc_services,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
