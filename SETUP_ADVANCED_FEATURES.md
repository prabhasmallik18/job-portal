# 🚀 Quick Setup Guide for Advanced Features

## Step 1: Install Dependencies (If Not Already Installed)

```bash
cd server
npm install mongoose

# Verify installations
npm list mongoose @google/generative-ai express
```

## Step 2: Environment Variables

Make sure your `.env` file includes:

```env
# Existing variables
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# NEW for Advanced Features
GEMINI_API_KEY=your_google_gemini_api_key
GOOGLE_API_KEY=your_google_api_key
```

Get your Gemini API Key:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Paste it in .env

## Step 3: Start Backend Server

```bash
cd server
npm run server

# You should see:
# ✅ Server running on port 5000
# ✅ Connected to MongoDB
# 🔍 Config Check:
# - GEMINI_API_KEY: ✅ SET
```

## Step 4: Test API Endpoints

```bash
# Test Application Tracker
curl -X GET http://localhost:5000/api/applications/dashboard/USER_ID

# Test Resume Analyzer  
curl -X POST http://localhost:5000/api/resume/analyze \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID","resumeUrl":"url"}'

# Test Gamification
curl -X POST http://localhost:5000/api/gamification/initialize \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID"}'

# Test Leaderboard
curl -X GET http://localhost:5000/api/gamification/leaderboard

# Test Salary Market Data
curl -X GET "http://localhost:5000/api/salary/market-data?role=React%20Developer&location=Bangalore"
```

## Step 5: Import Components in Frontend

```bash
cd client
```

In your App.jsx or Router:

```jsx
import ApplicationTracker from './components/ApplicationTracker'
import ResumeAnalyzer from './components/ResumeAnalyzer'
import InterviewPrep from './components/InterviewPrep'
import SalaryNegotiator from './components/SalaryNegotiator'
import Gamification from './components/Gamification'

function App() {
  return (
    <Routes>
      <Route path="/applications" element={<ApplicationTracker userId={userId} />} />
      <Route path="/resume" element={<ResumeAnalyzer userId={userId} />} />
      <Route path="/interview" element={<InterviewPrep userId={userId} />} />
      <Route path="/salary" element={<SalaryNegotiator userId={userId} />} />
      <Route path="/gamification" element={<Gamification userId={userId} />} />
    </Routes>
  )
}
```

## Step 6: Create Styling (CSS Modules)

Create CSS files for each component:

```
client/src/components/
├── ApplicationTracker.module.css
├── ResumeAnalyzer.module.css
├── InterviewPrep.module.css
├── SalaryNegotiator.module.css
└── Gamification.module.css
```

Basic template for ApplicationTracker.module.css:

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

.statsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.statCard {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 10px;
  color: white;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.statIcon {
  font-size: 32px;
}

.statNumber {
  font-size: 28px;
  font-weight: bold;
  margin: 10px 0;
}

.applications {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.appCard {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.appCard:hover {
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  transform: translateY(-5px);
}

@media (max-width: 768px) {
  .statsGrid {
    grid-template-columns: 1fr;
  }

  .applications {
    grid-template-columns: 1fr;
  }
}
```

## Step 7: Test Everything

1. **Open Dashboard**
   - Navigate to http://localhost:3000/applications
   - Should see stats and empty applications list

2. **Test Resume Analyzer**
   - Upload a sample resume
   - Should get ATS score and feedback

3. **Test Interview Prep**
   - Click "Start Interview"
   - Should generate questions

4. **Test Gamification**
   - Visit gamification page
   - Should see profile, level, and points

## Step 8: Production Deployment

### Backend (Deploy on Vercel/Railway)

```bash
# Create vercel.json (already exists)
# Deploy with:
vercel --prod
```

### Frontend (Deploy on Vercel/Netlify)

Update API base URL for production:

```jsx
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

// Use in requests:
fetch(`${API_URL}/api/applications/dashboard/${userId}`)
```

Set env variable:
```
REACT_APP_API_URL=https://your-api.vercel.app
```

## 🎯 Feature Activation Checklist

- [ ] All models created and exported
- [ ] All controllers implemented
- [ ] All routes added to server.js
- [ ] Components created with styling
- [ ] Environment variables set
- [ ] API endpoints tested
- [ ] Components imported in App.jsx
- [ ] Routes added to Router
- [ ] CSS modules created
- [ ] Mobile responsive verified
- [ ] Error handling tested
- [ ] Production build passes

## 📊 Expected Files Created

### Backend Files (New)
```
server/models/
├── ApplicationTracker.js          ✅
├── ResumeAnalysis.js             ✅
├── InterviewPractice.js          ✅
├── SalaryData.js                 ✅
└── Gamification.js               ✅

server/controllers/
├── applicationTrackerController.js   ✅
├── resumeAnalyzerController.js      ✅
├── interviewPrepController.js       ✅
├── salaryNegotiationController.js   ✅
└── gamificationController.js        ✅

server/routes/
├── applicationTrackerRoutes.js    ✅
├── resumeAnalyzerRoutes.js        ✅
├── interviewPrepRoutes.js         ✅
├── salaryNegotiationRoutes.js     ✅
└── gamificationRoutes.js          ✅

server/server.js                   ✅ (Updated)
```

### Frontend Files (New)
```
client/src/components/
├── ApplicationTracker.jsx         ✅
├── ResumeAnalyzer.jsx            ✅
├── InterviewPrep.jsx             ✅
├── SalaryNegotiator.jsx          ✅
└── Gamification.jsx              ✅
```

## 🆘 Troubleshooting

**Q: API returns 404 errors**
- A: Verify routes are imported in server.js ✅ Done

**Q: Resume analysis fails**
- A: Check GEMINI_API_KEY is set in .env

**Q: Components not rendering**
- A: Ensure userId is passed as prop to components

**Q: Styles not applying**
- A: Create .module.css files with same names

**Q: Database collections empty**
- A: Make sure endpoints are called to create records

---

## 📞 Quick Command Reference

```bash
# Start backend
cd server && npm run server

# Start frontend
cd client && npm run dev

# Test API
curl http://localhost:5000/api/debug/config

# View MongoDB
mongosh "mongodb+srv://user:pass@cluster..."

# Deploy
git push heroku main  # or your deploy provider
```

---

**Status**: ✅ All Features Ready
**Next Step**: Start the server and test!

Good luck! 🚀