# MEDICORUM (Healthcare Appointment Management System)

## Overview
This is a **Healthcare Appointment Management System** built using **Node.js, Express, MongoDB, and EJS**. The application allows **admins, doctors, and students (patients)** to interact with the system for scheduling, managing appointments, generating reports, and handling prescriptions.

## Features
- **User Authentication:** Secure login for admins, doctors, and patients.
- **Appointment Scheduling:** Patients can book, modify, and cancel appointments.
- **Doctor Management:** Admins can add, view, and delete doctor profiles.
- **Prescription Management:** Doctors can generate prescriptions for patients.
- **Reports & Logs:** Admins and doctors can generate reports for medical records.
- **OTP Verification:** Password recovery with OTP-based verification.
- **Secure Cookies & Middleware:** Uses **cookie-parser** for managing authentication sessions.

## Project Structure
```
Healthcare-Appointment-System/
│── connection/              # Database connection setup
│── controller/              # Business logic and request handling
│── model/                   # Mongoose models for database
│── node_modules/            # Dependencies
│── routers/                 # Express routes
│── views/                   # EJS frontend templates
│   ├── admin/               # Admin dashboard & pages
│   ├── doctor/              # Doctor portal
│   ├── student/             # Patient portal
│   ├── images/              # Static assets
│   ├── styles/              # CSS styles
│── .gitignore               # Git ignore file
│── app.js                   # Main Express app
│── LICENSE                  # License details
│── package-lock.json        # Package dependency lock
│── package.json             # Node.js dependencies
│── README.md                # Project documentation
```

## Installation & Setup
### Prerequisites
Ensure you have **Node.js** and **MongoDB** installed.

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/SagarMaddela/MEDICORUM.git
   cd MEDICORUM
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start MongoDB (if not running already):
   ```sh
   mongod --dbpath=/data/db
   ```
4. Start the application:
   ```sh
   npm start
   ```
5. Open in browser:
   ```sh
   http://localhost:3000
   ```

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Frontend:** EJS, CSS
- **Authentication:** Cookies, OTP

## API Endpoints
### **Admin Routes**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET`  | `/adminlogin` | Admin login |
| `POST` | `/admin/patients` | Add patient |
| `POST` | `/deletedoctors` | Remove doctor |

### **Doctor Routes**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET`  | `/doctor/login` | Doctor login |
| `GET`  | `/doctor/patients` | View assigned patients |
| `POST` | `/createmedication` | Create a prescription |

### **Student Routes**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET`  | `/student/login` | Student login |
| `POST` | `/appointment` | Book appointment |
| `POST` | `/cancelAppointment` | Cancel appointment |

## Contribution
Feel free to fork and contribute via pull requests. Follow best practices and document your changes properly.

## License
This project is licensed under the **MIT License**. See `LICENSE` for details.

