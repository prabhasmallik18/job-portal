/**
 * IMPORTANT: Testing Guide for Job Portal
 * 
 * ISSUE 1: Company Logo Not Showing ✅ FIXED
 * - JobCard component now displays: job?.companyId?.image
 * - Falls back to placeholder if image doesn't exist
 * 
 * ISSUE 2: Token Error "Invalid token format" ✅ FIXED
 * - Middleware now properly validates JWT tokens
 * - Only traditional auth (email/password) works for job applications
 * - Clerk/Google users can view jobs but need email/password to apply
 * 
 * TESTING STEPS:
 * 
 * 1. USER REGISTRATION
 *    - Click "User Login" in navbar
 *    - Enter: name, email, password
 *    - Click "Register"
 *    - Should show "Registration successful"
 *    - App saves JWT token to localStorage
 * 
 * 2. USER LOGIN
 *    - Click "User Login"
 *    - Enter registered email and password
 *    - Should show "Login successful"
 *    - User should see name in navbar
 *    - JWT token saved to localStorage
 * 
 * 3. VIEW JOBS WITH LOGOS
 *    - Go to Home page
 *    - All jobs should show company logos
 *    - 9 sample jobs should be visible
 * 
 * 4. APPLY FOR JOB (TRADITIONAL USER)
 *    - Login with email/password
 *    - Click "Apply Now" on any job
 *    - Should prompt to upload resume if not present
 *    - Upload resume (PDF/DOC/DOCX)
 *    - Should show "Applied successfully"
 *    - Be redirected to applications page
 * 
 * 5. VIEW APPLICATIONS
 *    - Click "Applied Jobs" in navbar
 *    - Should show all applied jobs with status
 *    - Confirm user data was saved
 * 
 * 6. GOOGLE LOGIN (VIEW ONLY)
 *    - Click "Google Login"
 *    - Can view jobs and company logos
 *    - Shows "Viewing mode only" in navbar
 *    - Cannot apply for jobs (see message to use email/password)
 * 
 * TROUBLESHOOTING:
 * 
 * If "Invalid token format" error:
 *    - Clear localStorage
 *    - Close browser and reopen
 *    - Register/login again with email/password
 *    - Make sure JWT_SECRET is set in backend .env
 * 
 * If logos still not showing:
 *    - Check MongoDB: db.jobs should have companyId populated
 *    - Check company documents have "image" field
 *    - Run: node seed.js again
 * 
 * If can't apply for job:
 *    - Must be logged in with email/password (not Google)
 *    - Resume must be uploaded first
 *    - Check browser console for detailed errors
 * 
 * DATABASE VERIFICATION:
 * 
 * MongoDB commands to verify:
 *    - db.jobs.findOne({}) 
 *      Should show: companyId: {..., image: "url..."}
 *    - db.companies.findOne({})
 *      Should show: image: "url..."
 *    - db.jobapplications.findOne({})
 *      Should show: userName, userEmail, userResume
 */
