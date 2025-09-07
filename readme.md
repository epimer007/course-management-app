# 📚 Course Management App

A **Next.js + TypeScript + MongoDB** application for managing online courses.  
This project provides a backend API with CRUD operations, category search, recommendations, and initial data seeding.  

---

## ⚡ Tech Stack Used

- **Next.js** – React framework (frontend + backend API routes)  
- **TypeScript** – type safety and better development experience  
- **MongoDB Atlas** – cloud database for persistence  



---

## 🚀 Features Implemented

- **CRUD Operations**  
  - Create, Read, Update, Delete courses  

- **Search & Filter**  
  - Find courses by category (case-insensitive)  

- **Recommendations**  
  - Recommend top courses based on user preferences (`level`, `category`, `maxPrice`)  

- **Automatic Timestamps**  
  - `createdAt` and `updatedAt` managed automatically  

- **Database Seeding**  
  - Inserts sample courses if DB is empty  

---

## 🛠️ How to Run Locally

### 1. Clone Repository

git clone https://github.com/your-username/course-management-app.git
cd course-management-app
npm install

---

###  Create a .env.local file in the project root:
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=course_management

## RUN
npm run dev

