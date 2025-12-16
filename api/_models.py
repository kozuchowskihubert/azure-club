"""
Database models for serverless API
"""
from sqlalchemy import Column, Integer, String, Text, Float, Date, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from api._db import Base

class Event(Base):
    __tablename__ = 'events'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    date = Column(Date, nullable=False)
    time = Column(String(10))
    venue = Column(String(200))
    city = Column(String(100))
    type = Column(String(50))
    description = Column(Text)
    artists = Column(String(500))
    price = Column(Float)
    capacity = Column(Integer)
    image_url = Column(String(500))
    status = Column(String(50), default='upcoming')
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Booking(Base):
    __tablename__ = 'bookings'
    
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey('events.id'), nullable=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    phone = Column(String(50))
    event_date = Column(String(50))
    event_type = Column(String(50))
    start_time = Column(String(50))
    duration = Column(Integer)
    venue = Column(String(200))
    city = Column(String(100))
    guests = Column(Integer, default=1)
    message = Column(Text)
    status = Column(String(50), default='pending')
    calendar_event_sent = Column(Boolean, default=False)
    calendar_platforms = Column(String(200))
    event_title = Column(String(500))
    event_location = Column(String(500))
    created_at = Column(DateTime, server_default=func.now())
