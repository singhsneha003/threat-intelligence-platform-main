# Threat Intelligence Project

This project consists of a frontend and backend designed to work together seamlessly. It also includes a database file (`threat-intelligence.sql`) to set up the required database structure. Follow the instructions below to set up and run the project locally.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
   - [Clone the Repository](#clone-the-repository)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
   - [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Project Structure](#project-structure)
7. [Contributing](#contributing)
8. [License](#license)

---

## Project Overview

The Threat Intelligence Project is a web application designed to provide actionable insights for security threats. It includes a user-friendly frontend for interaction and a robust backend for handling data and business logic.

---

## Technologies Used

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Tools & Libraries:** Axios, React Router, JWT for authentication

---

## Prerequisites

Ensure you have the following installed on your system:

1. **Node.js** (v14 or higher) and npm
2. **MySQL** (or a compatible database server)
3. A code editor, preferably [VS Code](https://code.visualstudio.com/)
4. Git for version control

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/anonymous-gtx/threat-intelligence.git
cd threat-intelligence
```

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory and configure the environment variables:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=threat_intelligence
   JWT_SECRET=yourjwtsecret
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

The backend will run on [http://localhost:5000](http://localhost:5000).

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on [http://localhost:5173](http://localhost:5173).

### Database Setup

1. Open your MySQL client or command line.
2. Create a new database:
   ```sql
   CREATE DATABASE threat_intelligence;
   ```
3. Import the `threat-intelligence.sql` file into the newly created database:
   ```bash
   mysql -u root -p threat_intelligence < path/to/threat-intelligence.sql
   ```

Replace `path/to/` with the actual path to the SQL file.

---

## Running the Application

1. Ensure the backend server is running:
   ```bash
   cd backend
   npm start
   ```
2. Ensure the frontend development server is running:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open your browser and navigate to [http://localhost:5173](http://localhost:5173) to access the application.

---

## Project Structure

```plaintext
threat-intelligence/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   ├── index.js
│   ├── public/
│   ├── package.json
├── threat-intelligence.sql
└── README.md
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request on GitHub.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
