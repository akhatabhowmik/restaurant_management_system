# Restaurant Management System (Flavora)

## Overview

This is a full-stack restaurant management application designed to handle customer-facing reservations and administrative operations. The system is split into two primary components:

### User Application
*   **Menu and Staff Showcase**: Customers can view categories, active menu items, testimonials, and active chefs.
*   **Slot-Based Reservation System**: Authenticated users can book tables for a specific date and time slot (2:00 PM to 9:00 PM, up to 7 days in advance). Each slot has a strict capacity limit of 5 bookings.
*   **User Profile and History**: Registered users can update their profile information and view their reservation history.

### Admin Dashboard
*   **Visual Analytics**: Charts showing monthly income and reservation counts.
*   **Operational Management**: Management tools for editing banners, menu items, chefs, and contact reviews.
*   **Reservation Processing**: Review incoming reservations, assign table numbers, and confirm or cancel requests.
*   **Access Control**: Role-based access control ensuring only users with admin privileges can log in.

---

## Technical Stack

*   **Backend**: FastAPI, SQLModel (ORM), Uvicorn.
*   **Frontend**: HTML5, Vanilla CSS3, JavaScript (Bootstrap 5, jQuery, Chart.js).
*   **Database**: SQLite / PostgreSQL (configured via SQLModel).

---

## Steps to Run the Application

### 1. Run the Backend Server

Navigate to the backend directory and set up the Python virtual environment:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

*   **Windows (PowerShell)**: `.venv\Scripts\Activate.ps1`
*   **macOS/Linux**: `source .venv/bin/activate`

Install the required python packages:

```bash
pip install -r requirements.txt
```

Start the FastAPI development server:

```bash
uvicorn main:app --reload
```

The API endpoints will be accessible at `http://127.0.0.1:8000`. Interactive API documentation is available at `http://127.0.0.1:8000/docs`.

### 2. Run the Frontend Client

Serve the root directory of the project using any standard HTTP server.

For example, using Python's built-in HTTP server:

```bash
python -m http.server 5500
```

Alternatively, open the directory in VS Code and use the Live Server extension to host the application at `http://127.0.0.1:5500`.

*   **Customer Portal**: `http://127.0.0.1:5500/index.html`
*   **Admin Dashboard**: `http://127.0.0.1:5500/admin/index.html`
