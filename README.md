# 🎉 Eventify – University Club Event Management Platform  

<div align="center">  
<h1>Eventify</h1>  
</div>  

---

## 📑 Contents  
- [Introduction](#introduction)  
- [Core Features](#core-features)  
- [Objectives](#objectives)  
- [Audience](#audience)  
- [API Specification](#api-specification)  
- [Development Roadmap](#development-roadmap)  
- [Technology Stack](#technology-stack)  
- [Installation & Setup](#installation--setup)  
- [Contributors](#contributors)  

---

## 📌 Introduction <a id="introduction"></a>  

**Eventify** is a modern web application designed to simplify university club event organization. Built with the **MERN stack** (MongoDB, Express.js, React, Node.js) and optimized for deployment on **Vercel**, it empowers club organizers to host, manage, and track events while giving students an intuitive way to register, participate, and stay engaged.  

---

## 🚀 Core Features <a id="core-features"></a>  

1. **Authentication & Role Management**  
   - Secure registration and login.  
   - Role-specific permissions for students and organizers.  

2. **Event Lifecycle Management**  
   - Create, update, and remove events (organizers).  
   - Access event details and participation status (students).  

3. **Student Portal**  
   - Browse all upcoming events.  
   - Register or cancel participation seamlessly.  
   - Dashboard view of enrolled events.  

4. **Organizer Dashboard**  
   - Centralized panel for managing events.  
   - View participant lists and event insights.  

5. **Event Discovery Tools**  
   - Keyword search (by title, category, or date).  
   - Filters for upcoming, location-based, or category-specific events.  

6. **Automated Certificates**  
   - Post-event certificate generation and downloads for attendees.  

7. **User Sections**  
   - **Profile** → Manage personal details and view activity.  
   - **Dashboard** → Central hub for quick insights (student or organizer).  
   - **Events** → Explore, register, and manage events.  
   - **Clubs** → Browse and follow university clubs.  

---

## 🎯 Objectives <a id="objectives"></a>  

- **Simplify Event Management** → Provide organizers with a frictionless tool to manage events.  
- **Increase Student Engagement** → Encourage higher participation with smooth signup workflows.  
- **Accessibility & Usability** → Deliver a responsive and user-first interface.  
- **Community Building** → Foster connections between students, clubs, and staff.  

---

## 👥 Audience <a id="audience"></a>  

- **Students** → Interested in exploring and joining events.  
- **Club Leaders** → Responsible for organizing and managing activities.  
- **University Staff** → Supporting student affairs and engagement programs.  

---

## 📜 API Specification <a id="api-specification"></a>  

### 🔑 Authentication  
- `POST /register` → Create a new user account.  
- `POST /login` → Authenticate existing users.  

### 📅 Events  
- `GET /events` → Fetch all events.  
- `GET /events/{id}` → Fetch a specific event.  
- `POST /events` → Create an event (organizer only).  
- `PUT /events/{id}` → Update an event (organizer only).  
- `DELETE /events/{id}` → Delete an event (organizer only).  

### 📝 Registrations  
- `GET /registrations/{eventId}` → Get attendee list for an event.  
- `POST /registrations` → Register for an event.  
- `DELETE /registrations/{id}` → Cancel registration.  

### 🎓 Certificates  
- `GET /certificates/{eventId}` → Generate/download a certificate.  

### 🔍 Miscellaneous  
- `GET /search` → Search & filter events.  
- `GET /dashboard` → Personalized dashboard for student/organizer.  
- `GET /profile` → Fetch and update user profile.  
- `GET /clubs` → Browse university clubs.  

---

## 🛠 Development Roadmap <a id="development-roadmap"></a>  

**Phase 1: Foundation**  
- ✅ Backend + frontend setup (MERN).  
- ✅ Authentication (signup/login).  
- ✅ Core APIs for events and registrations.  
- ✅ Basic UI for auth and home.  

**Phase 2: Core Features**  
- ✅ Event registration/unregistration.  
- ✅ Search and filter implementation.  
- ✅ Student & organizer dashboards.  
- ✅ Auto-certificate generation.  
- ✅ Profile and Clubs sections.  

**Phase 3: Launch Prep**  
- ⬜ Full QA testing and bug resolution.  
- ⬜ Mobile optimization.  
- ⬜ Deployment on Vercel.  

---

## 💻 Technology Stack <a id="technology-stack"></a>  

- **Backend** → Node.js + Express.js  
- **Frontend** → React.js (Vite)  
- **Database** → MongoDB (Atlas or local)  
- **Version Control** → Git + GitHub  
- **Deployment** → Vercel  
- **Package Manager** → pnpm  

---

## ⚙️ Installation & Setup <a id="installation--setup"></a>  

### Prerequisites  
- Node.js ≥ 14.x  
- pnpm installed globally  
- MongoDB (Atlas or local)  
- Vercel CLI (optional for deployment)  

### Backend Setup (Express + Node.js)  
```bash
# Clone the repository
git clone https://github.com/yourusername/Eventify.git  

# Navigate into backend
cd Eventify/backend  

# Install dependencies
pnpm install  

# Create a .env file with the following:
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret  

# Start the backend
pnpm start  
```  

### Frontend Setup (React + Vite)  
```bash
# Navigate into frontend
cd Eventify/frontend  

# Install dependencies
pnpm install  

# Run the development server
pnpm run dev  

# Update .env file with backend API URL
VITE_API_URL=http://localhost:5000  
```  

---

## 🤝 Contributors <a id="contributors"></a>  

| Name | Email | GitHub |  
|------|-------|--------|  
| **Julker Nayeen Karim** | julkernkarim@gmail.com | [jnkarim](https://github.com/jnkarim) |  
| **Abdullah Al Tamim** | abdullahaltamim001@gmail.com | [abtaamim](https://github.com/abtaamim) |  
| **Md Al Amin** | alamin.cse.20220104154@aust.edu | [alaminXpro](https://github.com/alaminXpro) |  

---

✨ *Eventify is built to empower students and clubs with effortless event management. Thank you for checking out our project!*  
