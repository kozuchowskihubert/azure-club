from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/', methods=['GET'])
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'status': 'ok', 'message': 'Test endpoint works!'})

handler = app
