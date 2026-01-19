
# Parking Management System (Flask + SQLite)

demonstration video:  https://www.youtube.com/watch?v=i-MYzH8BHOg

A web-based **Parking Management System** built using **Flask** and **SQLite** that manages parking slots for Cars and Bikes. The system supports slot booking, fee calculation, late checkout penalties, and an Admin dashboard for monitoring parking activity.

This project is designed to automate parking operations and reduce manual management.

## Features

### User Module
- View available parking slots
- Book parking slots for Cars and Bikes
- Automatic parking fee calculation based on duration
- Checkout process with penalty calculation for late exit
- View real-time parking slot status

### Admin Module
- Secure admin login
- View all parking slot details
- Monitor occupied and free slots
- View payment and penalty details

## Tech Stack

| Technology | Purpose |
|---------|---------|
| Python | Backend |
| Flask | Web Framework |
| SQLite | Database |
| HTML / CSS | Frontend |
| Jinja2 | Template Engine |

## Project Structure

```

parking-management/
│
├── app.py              # Main Flask application
├── database.db         # SQLite database
│
├── templates/          # HTML templates
│   ├── index.html
│   ├── book_car.html
│   ├── book_bike.html
│   ├── checkout.html
│   ├── admin.html
│   └── ...
│
├── static/             # Static files
│
└── README.md           # Project documentation

````

## Installation & Setup

### Clone the Repository
```bash
git clone https://github.com/dogiemagi/digital-parking-system.git
cd parking-management-system
````

### Create Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install flask
```

## Run the Application

```bash
python app.py
```

Open in browser:
[http://127.0.0.1:5000/](http://127.0.0.1:5000/)

## Admin Access

Default admin credentials:

Username: admin
Password: admin123

Admin panel URL:
[http://127.0.0.1:5000/admin](http://127.0.0.1:5000/admin)

## Database Design

Table: parking_slots

* slot_number
* vehicle_type
* is_occupied
* vehicle_number
* vehicle_owner
* in_time
* out_time
* payment_status
* amount_paid
* penalty_time
* penalty_amount

## Security Features

* Session-based admin authentication
* SQLite database for persistent storage
* Secure random secret key generation
* Controlled access to admin routes

