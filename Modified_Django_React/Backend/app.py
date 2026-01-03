from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime, timedelta
import os

app = Flask(__name__)
app.url_map.strict_slashes = False

CORS(app)
app.secret_key = os.urandom(24)

# --- Database Initialization ---
def init_db():
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS parking_slots (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                slot_number INTEGER UNIQUE NOT NULL,
                vehicle_type TEXT NOT NULL,
                is_occupied INTEGER NOT NULL,
                vehicle_number TEXT UNIQUE,
                vehicle_owner TEXT,
                in_time TEXT,
                out_time TEXT,
                payment_status TEXT,
                amount_paid REAL DEFAULT 0,
                penalty_time REAL DEFAULT 0,
                penalty_amount REAL DEFAULT 0
            )
        ''')
        cursor.execute('SELECT COUNT(*) FROM parking_slots')
        if cursor.fetchone()[0] == 0:
            for i in range(1, 21):
                vehicle_type = 'Car' if i <= 10 else 'Bike'
                cursor.execute('INSERT INTO parking_slots (slot_number, vehicle_type, is_occupied) VALUES (?, ?, ?)',
                               (i, vehicle_type, 0))
        conn.commit()

# --- API Endpoints ---

@app.route('/api', methods=['GET'])
def api_index():
    return jsonify({"message": "Parking API backend is running"})

@app.route('/api/slots', methods=['POST'])
def get_slots():
    data = request.get_json()
    vehicle_type = data.get('vehicle_type')
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT slot_number FROM parking_slots WHERE vehicle_type=? AND is_occupied=0', (vehicle_type,))
        slots = [row[0] for row in cursor.fetchall()]
    return jsonify({"slots": slots})

@app.route('/api/book', methods=['POST'])
def book_slot():
    data = request.get_json()
    vehicle_number = data['vehicle_number']
    vehicle_owner = data['vehicle_owner']
    slot_number = data['slot_number']
    in_time = data['in_time']
    out_time = data['out_time']
    payment_method = data['payment_method']
    rate_per_hour = float(data['rate_per_hour'])

    in_time_dt = datetime.strptime(in_time, '%Y-%m-%dT%H:%M')
    out_time_dt = datetime.strptime(out_time, '%Y-%m-%dT%H:%M')
    duration = (out_time_dt - in_time_dt).total_seconds() / 3600
    amount_paid = int(duration * rate_per_hour)

    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT vehicle_number FROM parking_slots WHERE vehicle_number=?', (vehicle_number,))
        if cursor.fetchone():
            return jsonify({"success": False, "message": "This vehicle number is already booked."})

        cursor.execute('''
            UPDATE parking_slots
            SET is_occupied=1, vehicle_number=?, vehicle_owner=?, in_time=?, out_time=?, payment_status=?, amount_paid=?
            WHERE slot_number=?
        ''', (vehicle_number, vehicle_owner, in_time, out_time, payment_method, amount_paid, slot_number))
        conn.commit()

    return jsonify({"success": True, "slot_number": slot_number, "amount_paid": amount_paid})

@app.route('/api/status', methods=['GET'])
def parking_status():
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT slot_number, vehicle_type, vehicle_number, vehicle_owner, in_time, out_time, payment_status, amount_paid, is_occupied FROM parking_slots')
        slots = []
        for row in cursor.fetchall():
            slots.append({
                "slot_number": row[0],
                "vehicle_type": row[1],
                "vehicle_number": row[2],
                "vehicle_owner": row[3],
                "in_time": row[4],
                "out_time": row[5],
                "payment_status": row[6],
                "amount_paid": row[7],
                "is_occupied": bool(row[8])
            })
    return jsonify({"slots": slots})

@app.route('/api/checkout', methods=['POST'])
def checkout():
    data = request.get_json()
    vehicle_number = data.get('vehicle_number')
    vehicle_owner = data.get('vehicle_owner')

    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        # Fetch vehicle info
        cursor.execute('''
            SELECT slot_number, out_time, amount_paid, is_occupied, vehicle_type 
            FROM parking_slots 
            WHERE vehicle_number=? AND vehicle_owner=?
        ''', (vehicle_number, vehicle_owner))
        result = cursor.fetchone()

    if not result:
        return jsonify({"success": False, "message": "Vehicle not found."})

    slot_number, out_time_str, amount_paid, is_occupied, vehicle_type = result
    rate_per_hour = 5 if vehicle_type == 'Car' else 2

    if not is_occupied:
        return jsonify({"success": False, "message": "Vehicle not currently parked."})

    # Parse out_time
    out_time = datetime.strptime(out_time_str, '%Y-%m-%dT%H:%M')
    current_time = datetime.now()

    # Check for penalty (more than 30 mins late)
    if current_time > out_time + timedelta(minutes=30):
        penalty_time = (current_time - out_time).total_seconds() / 3600
        penalty_amount = int(penalty_time * rate_per_hour)

        with sqlite3.connect('database.db') as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE parking_slots 
                SET penalty_time=?, penalty_amount=? 
                WHERE vehicle_number=? AND vehicle_owner=?
            ''', (penalty_time, penalty_amount, vehicle_number, vehicle_owner))
            conn.commit()

        return jsonify({
            "success": False,
            "penalty": True,
            "penalty_amount": penalty_amount,
            "penalty_time": penalty_time,
            "message": f"Vehicle exceeded checkout time. Penalty: ₹{penalty_amount}"
        })

    # Clear the slot
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE parking_slots 
            SET is_occupied=0, vehicle_number=NULL, vehicle_owner=NULL,
                in_time=NULL, out_time=NULL, amount_paid=0, payment_status=NULL,
                penalty_time=0, penalty_amount=0
            WHERE vehicle_number=? AND vehicle_owner=?
        ''', (vehicle_number, vehicle_owner))
        conn.commit()

    return jsonify({
        "success": True,
        "message": "Checkout successful!"
    })


@app.route('/api/pay_penalty', methods=['POST'])
def pay_penalty():
    data = request.get_json()
    vehicle_number = data.get('vehicle_number')
    penalty_amount = int(data.get('penalty_amount', 0))

    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        # Update payment and reset penalty
        cursor.execute('''
            UPDATE parking_slots 
            SET payment_status="Paid", 
                amount_paid=0, 
                penalty_time=0, 
                penalty_amount=0,
                is_occupied=0,
                vehicle_number=NULL,
                vehicle_owner=NULL,
                in_time=NULL,
                out_time=NULL
            WHERE vehicle_number=?
        ''', (penalty_amount, vehicle_number))
        conn.commit()

    return jsonify({"success": True, "message": "Penalty paid and slot freed successfully."})


# Admin login
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'admin123'

@app.route('/api/admin_login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        return jsonify({"success": True, "message": "Login successful"})
    return jsonify({"success": False, "message": "Incorrect username or password"})

@app.route('/api/admin', methods=['GET'])
def admin_dashboard():
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT slot_number, vehicle_type, vehicle_number, vehicle_owner, in_time, out_time,
                   payment_status, amount_paid, penalty_amount, is_occupied
            FROM parking_slots
        ''')
        slots = []
        for row in cursor.fetchall():
            slots.append({
                "slot_number": row[0],
                "vehicle_type": row[1],
                "vehicle_number": row[2],
                "vehicle_owner": row[3],
                "in_time": row[4],
                "out_time": row[5],
                "payment_status": row[6],
                "amount_paid": row[7],
                "penalty_amount": row[8],
                "is_occupied": bool(row[9])
            })
    return jsonify({"slots": slots})

@app.route('/api/routes', methods=['GET'])
def show_routes():
    return jsonify([str(rule) for rule in app.url_map.iter_rules()])

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
