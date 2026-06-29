# 🧗‍♂️ Climbing Log App

> *"As an active rock climber, I often struggled to find a single, dedicated place to track my training progress and keep a personal log of my ascents. I built this application to solve my own real-world problem—combining a digital climbing diary with practical outdoor tools."*

A fullstack web application designed for rock climbers to log, manage, and analyze their climbing ascents. 


<img width="1789" height="819" alt="app-look" src="https://github.com/user-attachments/assets/035304e7-ed07-482b-a8e9-65103e84d417" />



---

## 📌 Key Features

* **Interactive Logbook:** Record personal ascents with instant crag and sector filtering.
* **Full CRUD Operations:** Easily add, edit, and delete logged climbing routes.
* **Live Climbing News:** A dedicated left-hand sidebar fetches the latest articles from **wspinanie.pl**. Clicking any news card opens the original article in a new browser tab.
* **Outdoor Weather Widget:** Check real-time local forecasts for selected climbing areas before heading out to the crag.
* **Training Analytics:** Automated stats tracking total climbed meters, favorite rock types, and ascent style distributions (OS, RP, Flash).

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Modern CSS
* **Backend:** Python 3.11, FastAPI, Uvicorn
* **Database:** MySQL 8 (via `mysql-connector-python`)
* **DevOps:** Docker, Docker Compose

---

## 💾 Database Architecture

The relational database (`app_dziennik_wsp`) is fully normalized into 5 core entities:

* **`uzytkownicy`** – stores user authentication profiles.
* **`lokalizacje`** – defines main climbing regions and rock types (e.g., Limestone, Granite).
* **`sektory`** – specific sub-areas linked directly to their parent crag.
* **`drogi`** – individual climbing routes containing grade, length, and sector relations.
* **`przejscia`** – the central logbook joining users with routes, recording style, attempts, date, rating (1–5), and personal notes.

---

## 🚀 Quickstart (One-Command Setup)

The application is strictly containerized. You only need **Docker** running on your host machine—no local Python, Node.js, or MySQL installation required.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/nborkala/climbing-log-app.git](https://github.com/nborkala/climbing-log-app.git)
   cd climbing-log-app
2. **Start the environment:**
   ```bash
   docker compose up --build
Important Note: On the very first run, MySQL requires ~15–20 seconds to initialize the schema and seed sample data from init.sql. The backend container will automatically hold and wait for the database healthcheck before booting up.

Open in your browser:
Web App: http://localhost:5173
API Docs (Swagger UI): http://localhost:8000/docs🔑 

## Test Accounts
The database is automatically seeded with sample test users for instant verification:
| Role / Account | Username (`login`) | Password (`haslo`) |
| :--- | :--- | :--- |
| **Test User 1** | `Wspinacz_Testowy` | `haslo123` |
| **Test User 2** | `Janusz_Skala` | `haslo123` |

## 🗺️ Roadmap & Future Development
 - The interface is currently in Polish (optimized for the Polish grading scale and local crags like Jura). An English language toggle and other climbig grades are planned for future releases.
 - Custom user profile avatars and signing up.
 - Advanced graph filtering for seasonal progress tracking.
