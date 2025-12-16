"""Customer model for storing customer information."""
from datetime import datetime
from api import db


class Customer(db.Model):
    """Customer model for event bookers."""
    
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(20), nullable=False)
    company = db.Column(db.String(200))  # For corporate events
    address = db.Column(db.String(300))
    city = db.Column(db.String(100))
    postal_code = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    bookings = db.relationship('DJBooking', backref='customer', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Customer {self.first_name} {self.last_name}>'
    
    def to_dict(self):
        """Convert customer to dictionary."""
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'company': self.company,
            'address': self.address,
            'city': self.city,
            'postal_code': self.postal_code,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
