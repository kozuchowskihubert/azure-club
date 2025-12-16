"""
Vercel Serverless Function - Health Check
Simple endpoint to verify API is working
"""
from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {
            'status': 'ok',
            'message': 'ARCH1TECT API is running',
            'endpoint': '/api/health'
        }
        
        self.wfile.write(json.dumps(response).encode())
        return
