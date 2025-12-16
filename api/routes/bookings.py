"""Booking management routes."""
from flask import Blueprint

bp = Blueprint('bookings', __name__, url_prefix='/bookings')


@bp.route('/admin', methods=['GET'])
def admin_bookings():
    """Admin endpoint to view all bookings."""
    # This would require authentication in production
    return {'message': 'Admin bookings view'}, 200
