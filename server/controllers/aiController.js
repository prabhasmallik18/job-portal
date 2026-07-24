import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';

// Advanced smart responses with multiple variations for real conversations
const responseDatabase = {
    // Greeting variations
    greeting: [
        "Hello! 👋 I'm here to help with your tech career. What would you like to know?",
        "Hey there! 😊 Ask me about MERN stack, job opportunities, interview prep, or learning paths.",
        "Hi! Ready to help you grow your tech career. Pick any topic - MERN, jobs, interviews, or skills!",
        "Namaste! 🙏 Your AI Career Coach is here. What can I help you with today?",
    ],
    
    // Node.js specific
    nodejs: [
        "Node.js is JavaScript runtime for backend! Build REST APIs, real-time apps, microservices. Key skills: Express.js, async/await, callbacks, event-driven architecture. Combines V8 engine + event loop for blazing fast performance. Companies: Netflix, PayPal, LinkedIn use Node.js!",
        "Node.js rocks for backend! Learn: Express (routing), middleware, MongoDB integration, JWT auth, async programming. Build: chat apps, APIs, real-time systems. Single-threaded but handles 100K+ concurrent connections! Perfect for startups.",
        "Backend with Node.js: It's JavaScript on server! You get: Express framework, non-blocking I/O, npm ecosystem with 2M+ packages. Build everything from REST APIs to WebSocket servers. Learn async/await, handle errors well, and you're golden!",
    ],
    
    // React specific
    react: [
        "React is the queen of frontend! Component-based architecture, virtual DOM for performance, hooks for state management. Master: JSX, props, state, useEffect, custom hooks. Build: SPAs, dashboards, real-time apps. Every company needs React devs!",
        "Frontend with React: Learn component thinking, hooks (useState, useContext), props drilling solutions. Build: interactive UIs, animations with Framer Motion. Tools: React DevTools, Create React App, Vite. Companies: Facebook, Netflix, Airbnb built with React!",
        "React fundamentals: Components (functional > class), props/state, lifecycle, hooks. Advanced: Redux/Zustand for state, lazy loading, code splitting. Build portfolio: Todo app → E-commerce → Full portfolio project. You'll be job-ready in 2-3 months!",
    ],
    
    // MERN specific
    mern: [
        "MERN = Mongo + Express + React + Node. Full-stack with one language (JavaScript)! You control frontend (React), backend (Express), and database (MongoDB). Build complete projects from database queries to beautiful UIs. Industry-favorite stack!",
        "Complete Full-Stack: MongoDB (database), Express (backend framework), React (frontend), Node.js (runtime). Project: Build an app from scratch with user auth, database, APIs, beautiful UI. Takes 3-4 months to master, opens doors everywhere!",
        "MERN Stack mastery: Start with Node/Express APIs, connect MongoDB, then build React frontend. Learn: REST architecture, JWT tokens, CORS, deployment to Heroku/Vercel. Real project: Portfolio, Blog, E-commerce. Then you're HIREABLE!",
    ],
    
    // JavaScript specific
    javascript: [
        "JavaScript is everywhere! Frontend, backend (Node.js), mobile (React Native), automation. Master: ES6+, async/await, promises, closures, this keyword. Understand: event loop, hoisting, prototype chain. Build 5 projects and you're unbeatable!",
        "Core JavaScript: Functions, objects, arrays, DOM manipulation. Modern: arrow functions, destructuring, spread operator, template literals. Real power: async programming, event handling, API calls. Learn these deeply - frameworks come and go, but JS fundamentals are forever!",
    ],
    
    // Full Stack Developer
    fullstack: [
        "Full Stack = Frontend + Backend + Database! Learn both React (UI) and Node.js (Server). Full-stackers command 12-15 LPA easily. Master: HTML/CSS/JS → React → Node/Express → MongoDB. Build end-to-end projects. You become unstoppable! 💪",
        "Become Full Stack: 1) Frontend: React, responsive design, UX. 2) Backend: Node/Express, server architecture, database. 3) Deployment: Docker, AWS, CI/CD. Full-stackers are in CRAZY demand. Startups love them. Companies: Google, Amazon hire tons!",
        "Full Stack roadmap: Months 1-2: HTML/CSS/JS fundamentals. Months 2-3: React mastery. Months 3-4: Node/Express/MongoDB. Months 4-5: Full projects + deployment. Month 6: Interview prep. You're job-ready! Average salary: 8-12 LPA for freshers!",
    ],
    
    // Data Science
    datascience: [
        "Data Scientist path: Python (NumPy, Pandas, Scikit-learn) → Statistics & Probability → Machine Learning → Deep Learning (TensorFlow). Learn: data cleaning, visualization, model building. Companies: Amazon, Google, Microsoft hire tons. Salary: 10-15 LPA for freshers!",
        "Data Science bootcamp: 1) Python basics + libraries. 2) Exploratory Data Analysis (EDA). 3) Machine Learning (regression, classification, clustering). 4) Advanced: Deep Learning, NLP. Build: Kaggle projects, real-world datasets. Become data-driven problem solver!",
        "ML Engineer needed? Learn Python deeply, then: scikit-learn, TensorFlow, PyTorch. Statistics is KEY. Practice: Kaggle competitions, real datasets. Build portfolio: Price prediction, image classification, NLP projects. Very high demand + great pay!",
    ],
    
    // Interview prep
    interview: [
        "Crack tech interviews: 1) Master DSA (Arrays, Strings, Trees, Graphs, DP). 2) Practice 100 LeetCode problems (Easy → Medium → Hard). 3) Explain projects deeply. 4) System design for senior roles. 5) Mock interviews. You'll get offers!",
        "Interview roadmap: Week 1-2: Core DSA. Week 3-4: LeetCode grind (50 problems). Week 5: Project discussion practice. Week 6: Mock interviews. Week 7: Confidence building. Get offers from 5+ companies! Companies interview hundreds - you just need to be in top 1%.",
        "Preparation strategy: 1) Company research. 2) Behavioral answers (STAR method). 3) Technical deep dive (show you KNOW your projects). 4) DSA practice (consistency > speed). 5) Ask good questions. 6) Follow-up. Hiring managers want: humble, curious, smart developers!",
    ],
    
    // Job search
    jobsearch: [
        "Land tech jobs: 1) Build 3-4 killer projects. 2) LinkedIn: 500+ connections, post weekly. 3) Apply 20+ jobs daily. 4) Referrals (most powerful!). 5) Networking events/meetups. Expect 5-10% response rate. Persistence = job! 🎯",
        "Get hired fast: Github with contributions matters! Resume: projects > certifications. Cover letter: personalized. LinkedIn: profile pic, headline, connections. Apply: tier-1 (dream) + tier-2 (realistic) + tier-3 (safety). Track applications in spreadsheet!",
        "Job market 2026: Remote is normal, MERN/Python/DevOps in DEMAND. Build projects that solve real problems. Contribute to open source. Get GitHub stars = instant credibility. Networking > cold applications. Most jobs filled through referrals!",
    ],
    
    // Learning path
    learning: [
        "Best learning path: Pick specialty (MERN/Python/DevOps). Follow: Udemy courses + FreeCodeCamp (free!). Build projects immediately while learning. Practice daily (3-4 hours). Join communities: Dev.to, Reddit, Discord. Build in public on Twitter/LinkedIn!",
        "Learning strategy: 1) Understand concepts. 2) Build projects. 3) Teach others (write blogs!). 4) Contribute open source. 5) Repeat. Don't just watch tutorials! You learn by DOING. Build real things, break things, fix them. That's real learning!",
        "Skill building: Consistency beats marathons! 2 hours daily > 8 hours once. Learn: concept (30min) → code (90min) → debug (30min). Repeat. After 6 months: 720 hours invested = mastery level. Companies recognize dedication!",
    ],
    
    // Internship
    internship: [
        "Internship gold: Apply with projects already built. Top companies: Amazon, Google, Microsoft. Smaller: funded startups on AngelList. During internship: 1) Learn deeply. 2) Build something meaningful. 3) Ask for mentorship. 4) Network! Can lead to full-time offers!",
        "Internship strategy: Apply to 50+ companies. Build 2-3 projects first. Write good cover letter. During internship: take initiative, ask questions, deliver quality work. Get strong Letter of Recommendation (LOR) + consider full-time conversion!",
    ],
    
    // Python
    python: [
        "Python power: Backend (Django, FastAPI), Data Science, Automation, ML. Learn: syntax, OOP, file handling, libraries (NumPy, Pandas). Build: APIs, data analysis, web scrapers. Every company needs Python devs! Salary: 8-12 LPA for freshers!",
        "Python for different paths: 1) Web: Django/FastAPI → APIs. 2) Data: Pandas/Scikit-learn → ML. 3) Automation: beautiful soup, selenium → testing. Start with fundamentals, pick path, build projects!",
    ],
    
    // DevOps
    devops: [
        "DevOps hottest skill! Learn: Linux, Docker (containerization), Kubernetes (orchestration), CI/CD (Jenkins), AWS/Azure. DevOps engineers: 15-20 LPA, in EXTREME demand. Build projects: Docker containers, K8s clusters, CI/CD pipelines!",
        "DevOps path: Linux mastery → Docker containers → Kubernetes orchestration → CI/CD pipelines → Cloud (AWS). Practice: deploy apps to AWS, use Terraform for IaC, write deployment scripts. Very rewarding + high pay!",
    ],
};

// Get smart response based on prompt
const getSmartResponse = (prompt) => {
    const lower = prompt.toLowerCase().trim();
    
    // Node.js
    if (lower.includes("node") || (lower.includes("runtime") && lower.includes("javascript"))) {
        return responseDatabase.nodejs[Math.floor(Math.random() * responseDatabase.nodejs.length)];
    }
    
    // React
    if (lower.includes("react") && !lower.includes("native")) {
        return responseDatabase.react[Math.floor(Math.random() * responseDatabase.react.length)];
    }
    
    // MERN
    if (lower.includes("mern")) {
        return responseDatabase.mern[Math.floor(Math.random() * responseDatabase.mern.length)];
    }
    
    // JavaScript
    if ((lower.includes("javascript") || lower.includes("js")) && !lower.includes("json")) {
        return responseDatabase.javascript[Math.floor(Math.random() * responseDatabase.javascript.length)];
    }
    
    // Full Stack
    if (lower.includes("full stack") || lower.includes("fullstack")) {
        return responseDatabase.fullstack[Math.floor(Math.random() * responseDatabase.fullstack.length)];
    }
    
    // Data Science
    if (lower.includes("data scientist") || lower.includes("data science") || (lower.includes("data") && lower.includes("skill"))) {
        return responseDatabase.datascience[Math.floor(Math.random() * responseDatabase.datascience.length)];
    }
    
    // Interviews
    if (lower.includes("interview") || lower.includes("prep")) {
        return responseDatabase.interview[Math.floor(Math.random() * responseDatabase.interview.length)];
    }
    
    // Job Search
    if (lower.includes("job") || lower.includes("hiring") || lower.includes("career")) {
        return responseDatabase.jobsearch[Math.floor(Math.random() * responseDatabase.jobsearch.length)];
    }
    
    // Learning
    if (lower.includes("learn") || lower.includes("course") || lower.includes("study")) {
        return responseDatabase.learning[Math.floor(Math.random() * responseDatabase.learning.length)];
    }
    
    // Internship
    if (lower.includes("intern")) {
        return responseDatabase.internship[Math.floor(Math.random() * responseDatabase.internship.length)];
    }
    
    // Python
    if (lower.includes("python")) {
        return responseDatabase.python[Math.floor(Math.random() * responseDatabase.python.length)];
    }
    
    // DevOps
    if (lower.includes("devops") || lower.includes("docker") || lower.includes("kubernetes")) {
        return responseDatabase.devops[Math.floor(Math.random() * responseDatabase.devops.length)];
    }
    
    // Greetings
    if (lower.includes("hi") || lower.includes("hello") || lower.includes("hlo") || lower.includes("hey") || lower.includes("good morning") || lower.includes("good afternoon")) {
        return responseDatabase.greeting[Math.floor(Math.random() * responseDatabase.greeting.length)];
    }
    
    // Default
    return "Great question! I can help with: MERN stack, Node.js, React, Python, DevOps, data science, interviews, job search, and career growth. What specific topic would you like to dive into?";
};


export const getAiResponse = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.json({ 
                success: false, 
                message: "Please provide a valid question." 
            });
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        
        console.log("🤖 Processing:", prompt.substring(0, 40));
        
        try {
            if (!apiKey) {
                console.log("⚠️  No API key - using smart fallback");
                const answer = getSmartResponse(prompt);
                return res.json({ success: true, answer, isSmartFallback: true });
            }

            // Try REST API endpoint
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            
            const requestData = {
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 500
                }
            };

            console.log("📡 Calling Gemini REST API...");
            const response = await axios.post(apiUrl, requestData, {
                timeout: 20000,
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                const answer = response.data.candidates[0].content.parts[0].text;
                console.log("✅ Gemini API Success!");
                return res.json({ success: true, answer });
            }

        } catch (apiError) {
            console.error("❌ Gemini API Error:", apiError.response?.data || apiError.message);
        }

        // If API fails or unavailable, use smart fallback
        console.log("🔄 Using smart fallback response...");
        const answer = getSmartResponse(prompt);
        res.json({ 
            success: true, 
            answer: answer,
            isSmartFallback: true 
        });

    } catch (error) {
        console.error("❌ Error:", error.message);
        res.json({ 
            success: false, 
            message: "Could not process your request"
        });
    }
};