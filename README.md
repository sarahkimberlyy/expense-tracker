# 💰 Personal Expense Tracker (Dockerized)

A full-stack web application for tracking personal expenses. Built with **React (Vite)** frontend, **Node.js (Express + Sequelize)** backend, and **PostgreSQL** as the database — all containerized using **Docker** and orchestrated with **Docker Compose**.

---

## 🚀 Features

- **Add Expenses**: Input amount, description, category, and date.
- **View Expenses**: List all transactions with filters by date and category.
- **Edit/Delete**: Modify or remove existing expense records.
- **Categories**: Predefined types like Food, Transport, Entertainment, etc.
- **Summary Dashboard**: See total spending and category breakdown.
- **Pagination**: Browse expenses page by page with limit support.
- **API Proxying via Nginx**: Clean separation between frontend and backend.

---

## 🛠️ Tech Stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Frontend   | React (Vite), Nginx            |
| Backend    | Node.js, Express, Sequelize    |
| Database   | PostgreSQL                     |
| DevOps     | Docker, Docker Compose         |

---

## 📁 Project Structure

```

personal-expense-tracker/
├── backend/                 # Express backend with Sequelize
│   └── Dockerfile
├── frontend/                # React (Vite) frontend served by Nginx
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml       # Compose file to manage all services
└── README.md                # This file

```

## 📦 How to Run the App

### 1. Clone the repository

```bash
git clone https://github.com/sarahkimberlyy/expense-tracker.git
cd expense-tracker
```

### 2. Create `.env` file from template

Copy the example environment file and edit it with your database credentials:

```bash
cp .env.example .env
```

Make sure `.env` contains:

```env
POSTGRES_DB=expenses
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
```

> ⚠️ Never commit `.env` to version control. Only `.env.example` should be tracked.

```
```

### 3. Start the app with Docker Compose

```bash
docker-compose up --build
```

This will:

* Build and run the **frontend** on [http://localhost:3000](http://localhost:3000)
* Start the **backend API** on [http://localhost:3001](http://localhost:3001)
* Launch the **PostgreSQL** database with persistent volume

---

## ✅ Testing the App

* Access frontend: [http://localhost:3000](http://localhost:3000)
* Access backend directly: [http://localhost:3001/api/expenses](http://localhost:3001/api/expenses)
* Try adding, editing, and deleting expense records.
* Filter by category or date. Pagination also works!

---

## 🧹 Common Issues

### ❌ 502 Bad Gateway

If the frontend shows a 502:

* Make sure backend container is running and healthy.
* Restart with:

```bash
docker-compose down
docker-compose up --build
```

---

## 📌 License

This project is for educational use only.

---

## ✍️ Author

* Sarah Fischer