# HACKATHON PROJECT: Eventify – Club Event Management Platform for Universities

<div align="center">  
<h1>Eventify</h1>  
</div>  

---

### Table of Contents  
[Overview](#overview) – [Key Features](#key-features) – [Goals](#goals) – [Intended Users](#intended-users) – [API Routes](#api-routes) – [Project Roadmap](#project-roadmap) – [Tech Stack](#tech-stack) – [Setup Guide](#setup-guide) – [Contributors](#contributors)  

---

## 📝 Overview <a id="overview"></a>  

Eventify is a collaborative web application built to simplify university club event management. It enables organizers to create and manage events while allowing students to discover, register for, and track participation. The system is developed with the MERN stack (MongoDB, Express.js, React, Node.js) and is planned to be hosted on Vercel.  

---

## 💡 Key Features <a id="key-features"></a>  

**1. Secure Login & User Roles**  
- Account creation and sign-in.  
- Role-specific access for students and club organizers.  

**2. Event Handling**  
- Organizers can add, update, and remove events.  
- Students can browse event information and manage their registrations.  

**3. Student Tools**  
- Browse upcoming events easily.  
- Sign up or cancel registration for events.  
- Personal dashboard with list of registered events.  

**4. Organizer Tools**  
- Add new events.  
- Edit or remove events.  
- Check attendance lists.  
- Use an admin dashboard for full event oversight.  

**5. Event Discovery**  
- Search events by name, category, or schedule.  
- Filter based on date, location, or upcoming status.  

**6. Auto-Certificate Issuing**  
- Participants can download certificates generated automatically after events.  

---

## 🎯 Goals <a id="goals"></a>  

- **Efficient Event Handling**: Offer organizers a streamlined way to manage events.  
- **Boost Student Participation**: Make signing up for events simple and engaging.  
- **User-Friendly Access**: Deliver a clean and easy-to-use interface.  
- **Encourage Campus Community**: Create stronger connections between students and clubs.  

---

## 👥 Intended Users <a id="intended-users"></a>  

- Students interested in joining and tracking university events.  
- Club leaders organizing and managing activities.  
- Faculty or staff supporting student engagement programs.  

---

## 📜 API Routes <a id="api-routes"></a>  

### Authentication  
- **POST /register** → Register a new user.  
- **POST /login** → Log in an existing user.  

### Events  
- **GET /events** → Retrieve all events.  
- **GET /events/{id}** → Retrieve details of one event.  
- **POST /events** → Add new event (restricted to organizers).  
- **PUT /events/{id}** → Edit event details (organizers only).  
- **DELETE /events/{id}** → Remove event (organizers only).  

### Registrations  
- **GET /registrations/{eventId}** → Get attendees for an event.  
- **POST /registrations** → Sign up for an event.  
- **DELETE /registrations/{id}** → Cancel event registration.  

### Certificates  
- **GET /certificates/{eventId}** → Download participation certificate.  

### Miscellaneous  
- **GET /search** → Search or filter event listings.  
- **GET /dashboard** → Get dashboard data for student or organizer.  

---

## 📝 Project Roadmap <a id="project-roadmap"></a>  

**Milestone 1: Core Setup & Basics**  
- ✅ Configure backend and frontend (MERN).  
- ✅ Add authentication (signup and login).  
- ✅ Implement APIs for events and registrations.  
- ✅ Basic UI: login, register, homepage.  

**Milestone 2: Interactive Features**  
- ✅ Add register/unregister functionality.  
- ✅ Implement event search and filters.  
- ✅ Build dashboards for students & organizers.  
- ✅ Integrate certificate generator.  

**Milestone 3: Final Polish & Deployment**  
- ⬜ Conduct testing and fix issues.  
- ⬜ Improve mobile responsiveness.  
- ⬜ Deploy the final build on Vercel.  

---

## 💻 Tech Stack <a id="tech-stack"></a>  

- **Backend**: ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)  
- **Frontend**: ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=white)  
- **Database**: ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)  
- **Framework**: ![Express.js](https://img.shields.io/badge/-Express.js-000000?style=flat-square&logo=express&logoColor=white)  
- **Version Control**: ![Git](https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white)  
- **Repository**: ![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github&logoColor=white)  
- **Hosting**: ![Vercel](https://img.shields.io/badge/-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)  

---

## 🚀 Setup Guide <a id="setup-guide"></a>  

### Requirements  
- Node.js ≥ 14.x  
- npm or yarn  
- MongoDB (local or Atlas)  
- Optional: Vercel CLI  

**Backend Setup (Node.js + Express)**  
1. Clone the repository:  
```bash
git clone https://github.com/yourusername/Eventify.git
```  
2. Enter backend folder:  
```bash
cd Eventify/backend
```  
3. Install dependencies:  
```bash
npm install
```  
4. Add environment variables in `.env`:  
```plaintext
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```  
5. Run server:  
```bash
npm start
```  

**Frontend Setup (React)**  
1. Go to frontend folder:  
```bash
cd Eventify/frontend
```  
2. Install packages:  
```bash
npm install
```  
3. Start frontend server:  
```bash
npm run dev
```  
4. Update `.env` with API URL:  
```plaintext
VITE_API_URL=http://localhost:5000
```  

---

## 👥 Contributors <a id="contributors"></a>  

| **Name** | **Email** | **GitHub** |  
|---|---|---|  
| **Julker Nayeen Karim** | julkernkarim@gmail.com | [jnkarim](https://github.com/jnkarim) |  
| **Abdullah Al Tamim** | abdullahaltamim001@gmail.com | [abtaamim](https://github.com/abtaamim) |  
| **Md Al Amin** | alamin.cse.20220104154@aust.edu | [alaminXpro](https://github.com/alaminXpro) |  

---
