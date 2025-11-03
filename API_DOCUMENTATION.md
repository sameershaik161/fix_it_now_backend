# FixItNow API Documentation

## Overview
FixItNow is a Smart Home Service Platform that connects users with local service workers (plumbers, electricians, carpenters, etc.).

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user", // or "worker"
    "phone": "1234567890",
    "location": "New York",
    "skills": ["plumber", "electrician"] // only for workers
  }
  ```

#### Login
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

---

### User Routes (`/api/users`)

#### Get Current User
- **GET** `/users/me`
- **Auth:** Required

#### Update Profile
- **PUT** `/users/me`
- **Auth:** Required
- **Body:**
  ```json
  {
    "name": "John Doe",
    "phone": "1234567890",
    "location": "New York",
    "bio": "Experienced plumber"
  }
  ```

---

### Worker Routes (`/api/workers`)

#### Get All Workers (with filters)
- **GET** `/workers`
- **Query Params:**
  - `search` - Search by name
  - `skills` - Filter by skills (comma-separated)
  - `location` - Filter by location
  - `minRating` - Minimum rating (1-5)
  - `sort` - Sort order (`-rating`, `rating`, `name`, `-name`)
  - `page` - Page number
  - `limit` - Items per page

#### Get Worker by ID
- **GET** `/workers/:id`
- **Response includes completed jobs count**

#### Get Worker Dashboard
- **GET** `/workers/dashboard`
- **Auth:** Required (Worker role)
- **Returns:** Statistics, recent requests, earnings

#### Verify Worker (Admin only)
- **PUT** `/workers/:id/verify`
- **Auth:** Required (Admin role)

---

### Service Request Routes (`/api/requests`)

#### Create Request
- **POST** `/requests`
- **Auth:** Required (User role)
- **Form Data:**
  - `title` - Request title
  - `description` - Description
  - `address` - Service address
  - `scheduledAt` - Scheduled date/time
  - `price` - Estimated price
  - `images` - Up to 5 images (multipart/form-data)

#### Get All Requests
- **GET** `/requests`
- **Auth:** Required
- **Query Params:**
  - `status` - Filter by status
  - `page` - Page number
  - `limit` - Items per page
- **Note:** Users see their own requests, workers see open requests + assigned to them

#### Get Request by ID
- **GET** `/requests/:id`
- **Auth:** Required

#### Assign Worker to Request
- **PUT** `/requests/:id/assign`
- **Auth:** Required
- **Body (Admin only):**
  ```json
  {
    "workerId": "worker_id_here"
  }
  ```
- **Note:** Workers can self-assign by sending empty body

#### Update Request Status
- **PUT** `/requests/:id/status`
- **Auth:** Required
- **Body:**
  ```json
  {
    "status": "in_progress" // or "completed", "cancelled"
  }
  ```
- **Permissions:**
  - Users: Can only cancel
  - Workers: Can mark as in_progress or completed
  - Admins: Can set any status

---

### Review Routes (`/api/reviews`)

#### Create Review
- **POST** `/reviews`
- **Auth:** Required
- **Body:**
  ```json
  {
    "workerId": "worker_id",
    "rating": 5,
    "comment": "Great service!",
    "requestId": "request_id" // optional
  }
  ```

#### Get Worker Reviews
- **GET** `/reviews/worker/:workerId`
- **Query Params:**
  - `page` - Page number
  - `limit` - Items per page

#### Get My Reviews
- **GET** `/reviews/my-reviews`
- **Auth:** Required

#### Update Review
- **PUT** `/reviews/:id`
- **Auth:** Required (Review author only)
- **Body:**
  ```json
  {
    "rating": 4,
    "comment": "Updated comment"
  }
  ```

#### Delete Review
- **DELETE** `/reviews/:id`
- **Auth:** Required (Review author or admin)

---

### Notification Routes (`/api/notifications`)

#### Get Notifications
- **GET** `/notifications`
- **Auth:** Required
- **Query Params:**
  - `unreadOnly` - "true" to get only unread
  - `page` - Page number
  - `limit` - Items per page

#### Get Unread Count
- **GET** `/notifications/unread-count`
- **Auth:** Required

#### Mark as Read
- **PUT** `/notifications/:id/read`
- **Auth:** Required

#### Mark All as Read
- **PUT** `/notifications/read-all`
- **Auth:** Required

#### Delete Notification
- **DELETE** `/notifications/:id`
- **Auth:** Required

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Notification Types

Notifications are automatically created for:
- `request_assigned` - When a worker is assigned to a request
- `status_update` - When request status changes
- `new_review` - When a worker receives a review
- `worker_verified` - When a worker is verified by admin

---

## Request Status Flow

```
open → assigned → in_progress → completed
  ↓
cancelled (can be cancelled before completion)
```

---

## Models

### User Schema
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: "user" | "worker" | "admin",
  phone: String,
  location: String,
  bio: String,
  profileImage: String,
  skills: [String], // worker only
  rating: Number,
  ratingsCount: Number,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### ServiceRequest Schema
```javascript
{
  title: String,
  description: String,
  requester: ObjectId (User),
  worker: ObjectId (User),
  status: "open" | "assigned" | "in_progress" | "completed" | "cancelled",
  images: [String],
  price: Number,
  scheduledAt: Date,
  address: String,
  createdAt: Date
}
```

### Review Schema
```javascript
{
  author: ObjectId (User),
  worker: ObjectId (User),
  rating: Number (1-5),
  comment: String,
  createdAt: Date
}
```

### Notification Schema
```javascript
{
  recipient: ObjectId (User),
  sender: ObjectId (User),
  type: String,
  title: String,
  message: String,
  relatedRequest: ObjectId (ServiceRequest),
  relatedReview: ObjectId (Review),
  isRead: Boolean,
  createdAt: Date
}
```

---

## Features

### ✅ Implemented Features

1. **User Management**
   - Registration and authentication
   - Profile management
   - Role-based access control

2. **Worker Features**
   - Worker profiles with skills and ratings
   - Worker verification system
   - Worker dashboard with statistics
   - Search and filter workers

3. **Service Requests**
   - Create requests with image uploads
   - Assign workers to requests
   - Track request status
   - Detailed request view

4. **Review System**
   - Rate and review workers
   - Automatic rating calculation
   - Review management

5. **Notifications**
   - Real-time notification system
   - Unread count tracking
   - Notification filtering

6. **Advanced Search**
   - Filter by skills, location, rating
   - Sort by multiple criteria
   - Pagination support

---

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file with:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=30d
   ```

3. **Run Server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

4. **Frontend Setup**
   ```bash
   cd fix_it_now_frontend/fixitnow
   npm install
   npm run dev
   ```

---

## Frontend Routes

- `/` - Home page
- `/register` - User registration
- `/login` - User login
- `/workers` - Browse workers with filters
- `/workers/:id` - Worker profile with reviews
- `/create-request` - Create service request
- `/my-requests` - View user's requests
- `/requests/:id` - Detailed request view
- `/worker-dashboard` - Worker dashboard (worker only)
- `/notifications` - View notifications

---

## Notes

- All image uploads are stored in the `/uploads` directory
- Images can be accessed at `http://localhost:5000/uploads/filename`
- JWT tokens expire after 30 days (configurable)
- Passwords are hashed using bcrypt
- Real-time notification polling every 30 seconds on frontend
