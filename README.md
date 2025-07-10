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

````

---

## 🐳 Dockerfile Summaries

### Backend (`backend/Dockerfile`)
```dockerfile
FROM node:20-alpine              # Lightweight Node.js base
WORKDIR /app                     # Set working directory
COPY package*.json ./            # Copy dependency files
RUN npm install                  # Install dependencies
COPY . .                         # Copy backend source
EXPOSE 3001                      # Expose backend port
CMD ["npm", "start"]             # Start the server
````

### Frontend (`frontend/Dockerfile`)

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration (`frontend/nginx.conf`)

```nginx
server {
  listen 80;

  location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri /index.html;  # SPA routing support
  }

  location /api/ {
    proxy_pass http://backend:3001;  # Forward API requests to backend
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

---

## ⚙️ `docker-compose.yml`

```yaml
version: "3.8"

services:
  backend:
    build: ./backend
    container_name: backend
    ports:
      - "3001:3001"
    environment:
      - POSTGRES_DB=expenses
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=yourpassword
    depends_on:
      - postgres
    networks:
      - app-network

  frontend:
    build: ./frontend
    container_name: frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - app-network

  postgres:
    image: postgres:15
    container_name: postgres
    environment:
      - POSTGRES_DB=expenses
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=yourpassword
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - app-network

volumes:
  pgdata:

networks:
  app-network:
    driver: bridge
```

---

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