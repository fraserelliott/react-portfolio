# Portfolio CMS

![Node.js](https://img.shields.io/badge/Backend-Node.js-43853D?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow)
![Deploy: Render](https://img.shields.io/badge/Deploy-Render-8357C5)

A lightweight, personal content management system built with **Node.js**, **Express**, **React** and **PostgreSQL**, designed to manage and showcase projects on a portfolio website. This CMS supports adding, editing, deleting, and tagging projects via a private dashboard, with all content dynamically displayed on the frontend.

## ▶️ Demo

[![Watch Demo 1](https://img.youtube.com/vi/2RAWELEAT-U/0.jpg)](https://youtu.be/2RAWELEAT-U)
[![Watch Demo 2](https://img.youtube.com/vi/hmNlZCbLAyM/0.jpg)](https://youtu.be/hmNlZCbLAyM)

## ✨ Features

- Add/Edit/Delete project posts via a secure dashboard
- Upload images via a custom Cloudinary integration
- Tag-based filtering for frontend project discovery
- Responsive design, mobile-friendly layout
- Authentication using JWT stored in sessionStorage
- Sequelize ORM with auto schema sync

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL (via Sequelize)
- **Frontend**: React
- **Deployment**: Render
- **Image Hosting**: Cloudinary

## 🎨 Frontend Methodology

Rather than relying on component libraries, this project uses reusable components I built with React. This approach:

- Offers full control over styling and behaviour
- Allows for immediate changes to styles without needing to track down framework variables
- Ensures consistency across elements (modals, toasts, form inputs, etc.)
- Served as a valuable learning experience in developing a lightweight, custom component library

## 📁 Folder Structure

```
project-root/
│
├── backend/               # Backend server logic and configuration
│   ├── config/            # Static configuration files (e.g., generated config.json)
│   ├── middleware/        # Middleware modules used in route handling
│   ├── models/            # Data models and structures
│   ├── routes/            # API route definitions
│   ├── scripts/           # CLI tools such as altering database schema
│   └── static-pages/      # Static HTML files served by the backend
│
├── frontend/              # React frontend
│   ├── public/            # Static assets exposed at the root (e.g., index.html, favicon)
│   └── src/               # Application source code
│       ├── assets/        # Images and other static resources
│       ├── components/    # Reusable React components
│       └── pages/         # Page-level components
└── README.md
```

## ✨ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/fraserelliott/react-portfolio.git
cd react-portfolio
```

### 2. Install dependencies

```bash
cd frontend
npm install
cd ../backend
npm install
```

### 3. Create a `.env` file in the backend folder from the `.env.example` file included.

```env
DB_DATABASE=your_db
DB_USERNAME=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_DIALECT=postgres
DB_PORT=3306
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloud
CLOUD_API_KEY=your_key
CLOUD_API_SECRET=your_secret
```

If deploying to a host like Render or Railway, provide DATABASE_URL instead of the DB environment variables.

### 4. Start the app

```bash
cd backend
npm run build
npm run start
```

Optional script that supports hot-reloading on saving the backend code. Run `npm run build` any time you update the code in `frontend`.

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:3001` (or the `PORT` specified in `.env`).

---

## 🖼️ Frontend

The portfolio will render posts dynamically on the homepage. Clicking a project opens a full detail page. There's also:

- A tag filter for narrowing down visible posts
- A custom dashboard to manage content, accessible by clicking on the wrench icon in the footer and logging in.

---

## 🔐 Admin Dashboard

- Authenticated via a JWT token
- Modal-based UI for managing posts
- Includes:
  - Create/Edit/Delete posts
  - Image upload via Cloudinary
  - Tag creation and filtering

---

## 📦 Deployment

This project is deployable on platforms like **Railway** or **Render**.

For Render:

1. Add your environment variables. You can either set all the DB variables separately, or set DATABASE_URL.
2. Create a database project.
3. Set the root folder to backend
4. Set the build command to `npm run build`
5. Set the deploy command to `npm run start`
6. Set up a custom domain (optional)

> 📚 [Cloudinary Setup Guide](https://cloudinary.com/documentation)
> 🚀 [Render Deployment Guide](https://render.com/docs)

---

## 🙋‍♂️ Contributing

Issues and PRs are welcome! Please open an issue to suggest features or report bugs.

---

## 💡 Feature Roadmap

- Search functionality to find projects
- Make site style and About section editable via the dashboard
- Contact form with optional email integration
- Improved media handling (e.g., video support)
- Server-side generation for indexing in search engines

---

## 📄 License

MIT License
