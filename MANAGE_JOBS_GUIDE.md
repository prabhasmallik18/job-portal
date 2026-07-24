# ✅ Manage Jobs - Troubleshooting Guide

## ✨ Database Status: Everything is Working! ✨

### 📊 Current Database Stats:
- ✅ Total Companies: 9
- ✅ Total Jobs: 49
- ✅ Jobs are properly linked to each company (6-7 jobs per company)

### 🏢 Companies with Jobs:
| Company Name | Jobs Count | Email | Password |
|---|---|---|---|
| Tech Solutions Inc | 7 | tech@techsolutions.com | tech@123 |
| Digital Innovators | 6 | hr@digitalinnovators.com | digital@123 |
| Cloud Infrastructure Ltd | 5 | careers@cloudinfra.com | cloud@123 |
| Quantum Systems Corp | 5 | jobs@quantumsys.com | quantum@123 |
| NeuralSync Technologies | 5 | career@neuralsync.com | neural@123 |
| NextGen Software | 5 | hr@nextgensw.com | nextgen@123 |
| DataPulse Analytics | 6 | recruit@datapulse.com | datapulse@123 |
| SecureNet Solutions | 5 | careers@securenet.com | secure@123 |

---

## 🚀 How to See "Manage Jobs"

### Step 1: Go to Recruiter Login ✅
1. Open http://localhost:5173/
2. Click "Recruiter Login" button (top-right)

### Step 2: Login with Company Credentials ✅
Use **ANY** of the credentials above. For example:
- Email: `tech@techsolutions.com`
- Password: `tech@123`

### Step 3: Click Dashboard 
After login, you'll be taken to dashboard. You should see:
- Add Job
- **Manage Jobs** ← Click here
- View Applications

### Step 4: View All Your Company's Jobs ✅
You should now see a table with:
- Job Title
- Date
- Location
- Required Skills
- Applicants

---

## 🔧 If Still Showing "No jobs found":

### Debug Steps:

**1. Check Browser Console (F12 → Console):**
```
Look for API responses like:
✅ "API Response: {success: true, jobs: [...]}"
or
❌ "API Response: {success: false, message: '...'}"
```

**2. Check Token in Browser Storage:**
- F12 → Application → Local Storage
- Look for key: `companyToken`
- It should have a long JWT token value

**3. Check if Your Company Actually Has Jobs:**
Visit this URL in browser:
```
http://localhost:5000/api/company/debug/stats
```

You should see which company has how many jobs.

---

## 💡 Manual Test

If you want to manually test the API:

**1. First, login to get token:**
```powershell
$loginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/company/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body (@{email="tech@techsolutions.com"; password="tech@123"} | ConvertTo-Json) `
  -UseBasicParsing

$token = ($loginResponse.Content | ConvertFrom-Json).token
$token
```

**2. Then, fetch jobs using token:**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/company/list-jobs" `
  -Method GET `
  -Headers @{"token"=$token} `
  -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

---

## ✅ Expected Result

When you log in as a recruiter and click "Manage Jobs", you should see:

```
Job Title | Date | Location | Required Skills | Applicants
------|------|----------|-----------------|----------
Senior Full Stack Developer | 3/28/2026 | Bangalore | React, Node.js... | 0
Backend Developer (Node.js) | 3/27/2026 | Washington | Node.js, Express... | 0
...and many more...
```

---

## 🎯 Quick Checklist Before Viewing:

- [x] Backend server running (`npm start` in /server)
- [x] Frontend running (`npm run dev` in /client)
- [x] Database has jobs seeded ✅
- [ ] **Login as Recruiter** (use credentials above)
- [ ] **Navigate to Dashboard**
- [ ] **Click on Manage Jobs**

If you follow these steps, you **WILL** see all your company's jobs! 🚀
