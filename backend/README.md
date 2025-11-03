# 🏠 FixItNow - Smart Home Service Platform

A comprehensive full-stack web application connecting homeowners with local service workers (plumbers, electricians, carpenters, etc.).

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)

---

## ✨ Features

### Core Functionality
- 🔐 **Authentication & Authorization** - JWT-based secure authentication with role-based access
- 👥 **User Management** - Profile management for users, workers, and admins
- 🔧 **Worker Profiles** - Detailed profiles with skills, ratings, and reviews
- 📋 **Service Requests** - Create, track, and manage service requests
- 📸 **Image Upload** - Upload up to 5 images per request
- ⭐ **Review System** - Rate and review workers
- 🔔 **Notifications** - Real-time notification system for status updates
- 📊 **Worker Dashboard** - Statistics, earnings tracking, and job management

### Advanced Features
- 🔍 **Advanced Search & Filters** - Filter workers by skills, location, and rating
- 📈 **Analytics Dashboard** - Track performance metrics for workers
- ✅ **Worker Verification** - Admin verification system for workers
- 🎯 **Smart Status Tracking** - Automated workflow for request lifecycle
- 💰 **Price Management** - Set and track service pricing
- 📅 **Scheduling** - Schedule service appointments
- 🔄 **Request Assignment** - Workers can self-assign or admin can assign

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Express-async-errors** - Error handling

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **Vite** - Build tool

---

## 📁 Project Structure

```
fixitnow_backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── authControllers.js    # Authentication logic
│   │   ├── userController.js     # User management
│   │   ├── workerController.js   # Worker operations
│   │   ├── requestController.js  # Service requests
│   │   ├── reviewController.js   # Review system
│   │   └── notificationController.js # Notifications
│   ├── middlewares/
│   │   ├── auth.js               # JWT authentication
│   │   ├── errorHandle.js        # Error handling
│   │   └── upload.js             # File upload
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── ServiceRequest.js     # Request schema
│   │   ├── Review.js             # Review schema
│   │   └── Notification.js       # Notification schema
│   └── routes/
│       ├── auth.js               # Auth routes
│       ├── users.js              # User routes
│       ├── worker.js             # Worker routes
│       ├── requests.js           # Request routes
│       ├── reviews.js            # Review routes
│       └── notifications.js      # Notification routes
├── uploads/                      # Uploaded images
├── fix_it_now_frontend/
│   └── fixitnow/
│       ├── src/
│       │   ├── api/
│       │   │   └── axios.jsx     # Axios configuration
│       │   ├── components/
│       │   │   ├── Header.jsx    # Navigation header
│       │   │   ├── RequestCard.jsx
│       │   │   └── WorkerCard.jsx
│       │   ├── context/
│       │   │   └── AuthContext.jsx # Auth state
│       │   └── pages/
│       │       ├── Home.jsx
│       │       ├── Login.jsx
│       │       ├── Register.jsx
│       │       ├── Workers.jsx
│       │       ├── WorkerProfile.jsx
│       │       ├── WorkerDashboard.jsx
│       │       ├── CreateRequest.jsx
│       │       ├── MyRequests.jsx
│       │       ├── RequestDetails.jsx
│       │       └── Notifications.jsx
│       └── package.json
├── server.js                     # Main server file
├── package.json
├── .env.example                  # Environment template
├── .gitignore
├── README.md
└── API_DOCUMENTATION.md          # Full API docs

```

---

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   cd fixitnow_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration

4. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd fix_it_now_frontend/fixitnow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file** (optional)
   ```bash
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

---

## ⚙️ Environment Setup

Create a `.env` file in the backend root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/fixitnow

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=30d

# Frontend (for CORS)
FRONTEND_URL=http://localhost:5173
```

---

## 📖 Usage

### User Roles

1. **Regular User**
   - Create service requests
   - Upload images
   - View and hire workers
   - Track request status
   - Leave reviews

2. **Worker**
   - View available requests
   - Accept job assignments
   - Update job status
   - View dashboard with statistics
   - Track earnings

3. **Admin**
   - Verify workers
   - Manage all requests
   - Assign workers to requests
   - Full system access

### Workflow

1. **User registers** and creates a service request
2. **Worker browses** open requests and accepts one
3. **Worker updates** status (assigned → in_progress → completed)
4. **User receives** notifications at each stage
5. **User reviews** worker after completion
6. **Worker rating** is automatically updated

---

## 📚 API Documentation

Full API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/workers` | Get all workers with filters |
| GET | `/api/workers/dashboard` | Worker dashboard |
| POST | `/api/requests` | Create service request |
| GET | `/api/requests/:id` | Get request details |
| PUT | `/api/requests/:id/status` | Update request status |
| POST | `/api/reviews` | Submit review |
| GET | `/api/notifications` | Get notifications |

---

## 🎨 Key Features Explained

### 1. Advanced Worker Search
```javascript
// Filter by multiple criteria
GET /api/workers?skills=plumber,electrician&location=New York&minRating=4&sort=-rating
```

### 2. Request Status Tracking
```
open → assigned → in_progress → completed
```
- Users can cancel before completion
- Workers can update to in_progress or completed
- Automatic notifications at each stage

### 3. Review System
- 1-5 star ratings
- Written reviews
- Automatic average calculation
- Review count tracking

### 4. Notification System
- Request assignment alerts
- Status update notifications
- New review notifications
- Real-time unread count
- Auto-polling every 30 seconds

### 5. Worker Dashboard
- Total jobs, completed, in-progress
- Earnings tracking
- Average rating
- Review count
- Recent requests list

---

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected routes
- Input validation
- XSS protection
- CORS configuration

---

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network access if using MongoDB Atlas

2. **Port Already in Use**
   ```bash
   # Change PORT in .env or kill process
   lsof -ti:5000 | xargs kill -9  # Mac/Linux
   ```

3. **Image Upload Issues**
   - Check `uploads` directory exists
   - Verify file permissions
   - Check MAX_FILE_SIZE in configuration

4. **CORS Errors**
   - Verify FRONTEND_URL in `.env`
   - Check CORS configuration in `server.js`

---

## 🚧 Future Enhancements

- [ ] Real-time chat between users and workers
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Payment gateway integration
- [ ] Google Maps integration
- [ ] Mobile app (React Native)
- [ ] Worker availability calendar
- [ ] Multi-language support
- [ ] Advanced analytics

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Your Name - [Your GitHub](https://github.com/yourusername)

---

## 📞 Support

For support, email support@fixitnow.com or open an issue in the repository.

---

## 🙏 Acknowledgments

- Express.js team
- React team
- MongoDB team
- All open-source contributors

---

**Made with ❤️ using MERN Stack**
