# 🚀 FixItNow - Quick Start Guide

Get your FixItNow platform up and running in minutes!

---

## ⚡ Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v14+ installed
- ✅ MongoDB installed (local) OR MongoDB Atlas account
- ✅ Git installed
- ✅ Code editor (VS Code recommended)

---

## 🎯 Step-by-Step Setup

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd c:\Users\samee\OneDrive\Desktop\fixitnow_backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env file with your settings
# Required: MONGO_URI, JWT_SECRET
notepad .env
```

**Minimum .env configuration:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fixitnow
JWT_SECRET=your_secret_key_here_make_it_long_and_random
JWT_EXPIRES_IN=30d
```

```bash
# Start the backend server
npm run dev
```

✅ Backend should be running at `http://localhost:5000`

---

### Step 2: Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend directory
cd c:\Users\samee\OneDrive\Desktop\fixitnow_backend\fix_it_now_frontend\fixitnow

# Install dependencies
npm install

# Start the frontend
npm run dev
```

✅ Frontend should be running at `http://localhost:5173`

---

## 🎨 First Run - Create Test Accounts

### 1. Create a Regular User
1. Open `http://localhost:5173/register`
2. Fill in details:
   - Name: John Doe
   - Email: user@test.com
   - Password: password123
   - Role: **user**
   - Phone: 1234567890
   - Location: New York

### 2. Create a Worker
1. Click "Register" again
2. Fill in details:
   - Name: Mike Worker
   - Email: worker@test.com
   - Password: password123
   - Role: **worker**
   - Phone: 9876543210
   - Location: New York
   - Skills: plumber, electrician

### 3. Create an Admin (Optional)
You can manually create an admin in MongoDB or modify a user:
```javascript
// In MongoDB Compass or Shell
db.users.updateOne(
  { email: "user@test.com" },
  { $set: { role: "admin" } }
)
```

---

## 🎮 Testing the Platform

### As a User:

1. **Login** as user@test.com
2. **Browse Workers**
   - Go to `/workers`
   - Try the search and filters
   - Click on "Mike Worker"
   
3. **Create a Request**
   - Click "Create Request"
   - Fill in: Title, Description, Address, Price
   - Upload images (optional)
   - Submit

4. **Check Notifications**
   - Click the 🔔 icon
   - See system notifications

---

### As a Worker:

1. **Logout** and **Login** as worker@test.com
2. **View Dashboard**
   - Click "Dashboard" in navigation
   - See statistics (initially zeros)

3. **Accept a Request**
   - Go to "My Requests"
   - See open requests
   - Click "View Details"
   - Click "Accept This Request"

4. **Update Status**
   - In request details, click "Start Working"
   - Then click "Mark as Completed"

5. **Check Notifications**
   - See notification about status updates

---

### As a User (Continue):

1. **Login** back as user@test.com
2. **Check Notifications**
   - See notifications about:
     - Worker assigned
     - Status updates
     
3. **View Request**
   - Go to "My Requests"
   - See updated status

4. **Leave a Review**
   - Go to `/workers/[worker_id]`
   - Click "Write Review"
   - Rate 5 stars
   - Add comment
   - Submit

---

## 🧪 Testing All Features

### ✅ Feature Checklist

- [ ] User registration (user & worker roles)
- [ ] User login/logout
- [ ] Browse workers with no filters
- [ ] Search workers by name
- [ ] Filter workers by skills
- [ ] Filter workers by location
- [ ] Filter workers by rating
- [ ] Sort workers
- [ ] View worker profile
- [ ] Create service request
- [ ] Upload images to request
- [ ] View request details
- [ ] Worker self-assigns to request
- [ ] Worker updates status to in_progress
- [ ] Worker updates status to completed
- [ ] User receives notifications
- [ ] Worker receives notifications
- [ ] Mark notification as read
- [ ] Submit review for worker
- [ ] View worker reviews
- [ ] Worker dashboard shows stats
- [ ] Worker dashboard shows earnings
- [ ] Cancel request (before completion)

---

## 🔧 Common Issues & Solutions

### Issue: MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Ensure MongoDB is running
- Windows: Check Services → MongoDB Server
- Or use MongoDB Atlas (cloud)

---

### Issue: Port 5000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Change PORT in .env to 5001
# Or kill the process:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

### Issue: JWT Token Invalid
```
401 Unauthorized
```
**Solution:**
- Clear browser localStorage
- Re-login
- Check JWT_SECRET in .env

---

### Issue: Images Not Displaying
```
404 Not Found for /uploads/image.jpg
```
**Solution:**
- Ensure `uploads` folder exists in backend root
- Check file permissions
- Verify backend URL in frontend (http://localhost:5000)

---

### Issue: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Ensure backend is running on port 5000
- Check CORS configuration in `server.js`
- Verify API_URL in frontend `axios.jsx`

---

## 📊 Database Collections

After testing, your MongoDB should have these collections:

```
fixitnow/
├── users                 (Users, Workers, Admins)
├── servicerequests       (Service Requests)
├── reviews               (Worker Reviews)
└── notifications         (User Notifications)
```

View in MongoDB Compass: `mongodb://localhost:27017/fixitnow`

---

## 🎯 What's Next?

### Explore More Features:

1. **Advanced Filtering**
   - Try combining multiple filters
   - Test different sort options

2. **Notification System**
   - Watch badge update in real-time
   - Try marking all as read

3. **Worker Verification**
   - Create an admin account
   - Verify a worker
   - See verified badge

4. **Review System**
   - Submit multiple reviews
   - Watch rating calculation
   - View review history

5. **Request Workflow**
   - Test complete workflow:
     - User creates → Worker accepts → Updates status → Completes → User reviews

---

## 📱 Mobile Testing

The platform is responsive! Test on mobile:
1. Get your computer's IP address
2. Update frontend to use IP instead of localhost
3. Access from mobile browser on same network

---

## 🐛 Need Help?

### Debug Mode
Enable detailed logs:
```javascript
// In server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Check Backend Health
Visit: `http://localhost:5000/`
Should show: "Smart Home Backend is running"

### Check API Endpoint
Visit: `http://localhost:5000/api/workers`
Should return JSON with workers array

---

## 📚 Additional Resources

- **Full Documentation:** `README.md`
- **API Reference:** `API_DOCUMENTATION.md`
- **Features List:** `FEATURES_ADDED.md`
- **Frontend Docs:** `fix_it_now_frontend/fixitnow/README.md`

---

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Backend console shows "Server running on port 5000"
- ✅ Frontend opens at localhost:5173
- ✅ You can register and login
- ✅ Workers appear in /workers page
- ✅ Requests can be created
- ✅ Notifications appear in header
- ✅ Reviews can be submitted
- ✅ Worker dashboard shows statistics

---

## 💡 Pro Tips

1. **Keep Both Terminals Open**
   - One for backend (npm run dev)
   - One for frontend (npm run dev)

2. **Use MongoDB Compass**
   - Visual interface for database
   - Easy to view/edit data

3. **Browser DevTools**
   - F12 → Network tab (check API calls)
   - Console tab (check for errors)

4. **Test Different Roles**
   - Keep multiple browser windows
   - One logged in as user
   - One as worker

5. **Clear Cache**
   - If changes don't appear
   - Ctrl + Shift + R (hard refresh)

---

## 🚀 Ready to Launch!

Your platform is now fully functional with:
- ✅ User authentication
- ✅ Worker profiles
- ✅ Service requests
- ✅ Review system
- ✅ Notifications
- ✅ Advanced search
- ✅ Worker dashboard
- ✅ Image uploads

**Start exploring and building your smart home service marketplace!** 🏠✨

---

**Questions?** Check the documentation or create an issue in the repository.

**Happy Coding!** 🎊
