🧗‍♂️ Climbing Log App
"As an active rock climber, I often struggled to find a single, dedicated place to track my training progress and keep a personal log of my ascents. I built this application to solve my own real-world problem—combining a digital climbing diary with practical outdoor tools."

A fullstack web application designed for rock climbers to log, manage, and track their climbing ascents. The application allows users to record new entries, select specific crags and sectors, log ascent styles (OS, RP, Flash), rate routes, check local weather forecasts, and view their personal training statistics.  
SQL
+ 1

🛠️ Tech Stack
Frontend: React, Vite, CSS  
SQL

Backend: Python, FastAPI, Uvicorn  
SQL

Database: MySQL 8 (via mysql-connector-python)  
SQL

DevOps: Docker, Docker Compose  
SQL

📌 Features Overview
Interactive Logbook & CRUD: Easily add, edit, and delete personal climbing records with dynamic crag and sector filtering.  
SQL

Weather Integration: Real-time local weather forecast widget for selected climbing areas to help plan outdoor trips.  
SQL

Live Climbing News Feed: A dedicated sidebar on the left displays the latest articles from wspinanie.pl. Clicking on any news card opens the full, original article in a new browser tab.  
SQL
+ 1

Training Statistics: Automated calculations of total meters climbed, favorite rock types, and ascent style distributions.  
SQL

💾 Database Architecture
The relational database (app_dziennik_wsp) is normalized and divided into distinct entities to efficiently handle complex climbing data:  
SQL

lokalizacje (Locations): Stores main climbing regions and rock types (e.g., Limestone, Granite).  
SQL

sektory (Sectors): Sub-areas linked directly to specific locations.  
SQL

drogi (Routes): Individual climbing routes containing grades, lengths, and sector relationships.  
SQL

uzytkownicy (Users): Authentication profiles.  
SQL

przejscia (Ascents): Core log book linking users to routes along with style, attempts, date, rating, and personal notes.  
SQL

🚀 Quickstart (One-Command Setup)
The entire project is fully containerized. You do not need Python, Node.js, or MySQL installed locally on your host machine—only Docker and Docker Desktop running.  
SQL
+ 1

1. Clone the repository
Bash
git clone https://github.com/nborkala/climbing-log-app.git
cd climbing-log-app
2. Run the application
Bash
docker compose up --build
(Note: On the very first run, MySQL needs around 15–20 seconds to initialize the database schema and import sample data from init.sql. The backend container will automatically wait for the database healthcheck before starting).  
SQL

3. Access the application
Web Application (Frontend): http://localhost:5173

  
SQL

API Documentation (Swagger UI): http://localhost:8000/docs

  
SQL

🔑 Test Accounts
To explore the application without registering, use either of the pre-seeded test accounts:  
SQL

User	Username (login)	Password (haslo)
Test User 1	Wspinacz_Testowy	haslo123
Test User 2	Janusz_Skala	haslo123
(An additional third account Mocna_Kasia / haslo321 is also available in the database).  
SQL

🗺️ Roadmap & Future Development
[ ] Internationalization (i18n): The application interface is currently available in Polish (tailored to Polish climbing grades and local crags). An English language toggle switch will be implemented in future updates.  
SQL

[ ] Adding custom user profile avatars.

[ ] Advanced graph filtering for seasonal progress tracking.
