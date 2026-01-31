# Wanderlust 🌍

Wanderlust is a full-stack travel listing web application built with Node.js, Express, and MongoDB following the MVC architecture.

It enables users to create, review, and manage travel destinations with secure authentication, ownership-based authorization, image uploads, and dynamic map integration.


---

## 🚀 Features

- User authentication using Passport (Local Strategy)
- Session management with express-session
- Flash messages for real-time user feedback (create, update, delete actions)
- Ownership-based authorization (only listing owners can modify their listings)
- Full RESTful CRUD operations for listings
- Reviews & rating system for each listing
- Image upload using Multer and Cloudinary
- Dynamic map integration using Leaflet (latitude & longitude based)
- Modular routing and clean MVC structure
- Centralized error handling using custom ExpressError class

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- EJS & ejs-mate
- Passport.js
- express-session
- connect-flash
- Multer
- Cloudinary
- Leaflet
- Method-Override

---

## 🔐 Authentication & Authorization

- Session-based authentication
- Secure login & registration
- Route protection for sensitive actions
- Ownership validation for edit/delete operations

---
## 📌 Future Enhancements

- Category-based listing creation and advanced filtering
- Multiple image upload with gallery preview
- Saved/Favorite listings feature
- Pagination and performance optimization
- Admin dashboard for content moderation
- Full cloud deployment with production configuration
