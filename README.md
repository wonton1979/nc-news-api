# NC News API

NC News API is a RESTful API that serves Nothcoders' news, database include table of articles, comments, users, and topics. It is built using **Node.js, Express, PostgreSQL**,Using Supabase to connect database and live on Render.It is designed to be consumed by frontend applications.

## 🚀 Hosted Version

This API is live at:  
🔗 [NC News API on Render](https://nc-news-api-ph2d.onrender.com)  

You can see all available endpoints here:  
🔗 [`GET /api`](https://nc-news-api-ph2d.onrender.com/api) - Returns a list of available API routes.

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

https://github.com/wonton1979/nc-news-api.git

### 2️⃣ Install Dependencies

npm install

### 3️⃣ Setup Local Database and Seed Database

You need PostgreSQL installed. Create databases:

npm run setup-dbs (Setup local dabase and create all tables)

npm run seed-dev (Seed the database in develpoment environment)

## 4️⃣ Environment Variables (.env Files)
Create two .env files in the root directory:

.env.development

PGDATABASE=nc_news


.env.test

PGDATABASE=nc_news_test


###

## 📌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|------------|
| `GET`  | `/api` | Serves up a json representation of all the available endpoints of the api |
| `GET`  | `/api/topics` | Fetch all topics |
| `GET`  | `/api/articles` | Fetch all articles |
| `GET`  | `/api/articles/:article_id` | Fetch a single article which matching the article id |
| `PATCH`| `/api/articles/:article_id` | Update an article's votes |
| `GET`  | `/api/articles/:article_id/comments` | Fetch comments of the specific article |
| `POST` | `/api/articles/:article_id/comments` | Add a comment of the specific article |
| `DELETE` | `/api/comments/:comment_id` | Delete the particular comment |
| `GET`  | `/api/users` | Fetch all users |


## 🛠️ Tech Stack
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Hosting: Render
- Testing: Jest, Supertest

## ✨ Minimum Requirements
- Node.js: 18.x
- PostgreSQL: 14.x
