// Skill Gap Analyzer - Shows what skills user needs vs what they have

export const skillRequirements = {
    "MERN Developer": {
        required: ["react", "node.js", "express", "mongodb", "javascript"],
        preferred: ["typescript", "jwt", "rest api", "git", "docker"],
        salary: "8-12 LPA",
        experience: "0-2 years"
    },
    "React Developer": {
        required: ["react", "javascript", "html", "css", "state management"],
        preferred: ["typescript", "next.js", "redux", "testing", "webpack"],
        salary: "7-10 LPA",
        experience: "1-3 years"
    },
    "Node.js Developer": {
        required: ["node.js", "express", "javascript", "rest api", "databases"],
        preferred: ["typescript", "mongodb", "authentication", "microservices", "docker"],
        salary: "8-11 LPA",
        experience: "1-3 years"
    },
    "Python Developer": {
        required: ["python", "django/flask", "sql", "rest api", "git"],
        preferred: ["FastAPI", "celery", "postgresql", "redis", "testing"],
        salary: "7-10 LPA",
        experience: "1-3 years"
    },
    "Full Stack Developer": {
        required: ["react", "node.js", "express", "mongodb", "javascript"],
        preferred: ["typescript", "docker", "aws", "ci/cd", "testing"],
        salary: "10-15 LPA",
        experience: "2-4 years"
    },
    "DevOps Engineer": {
        required: ["linux", "docker", "kubernetes", "ci/cd", "aws/azure"],
        preferred: ["terraform", "jenkins", "monitoring", "bash", "git"],
        salary: "12-18 LPA",
        experience: "2-5 years"
    },
    "Data Scientist": {
        required: ["python", "statistics", "machine learning", "sql", "data analysis"],
        preferred: ["tensorflow", "scikit-learn", "pandas", "tableau", "deep learning"],
        salary: "10-15 LPA",
        experience: "1-3 years"
    }
};

export const analyzeSkillGap = (userSkills, targetRole) => {
    const roleRequirements = skillRequirements[targetRole];
    
    if (!roleRequirements) {
        return { error: "Role not found" };
    }
    
    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    
    // Find matching skills
    const matchedRequired = roleRequirements.required.filter(skill =>
        userSkillsLower.some(uSkill => uSkill.includes(skill.toLowerCase()))
    );
    
    const missingRequired = roleRequirements.required.filter(skill =>
        !userSkillsLower.some(uSkill => uSkill.includes(skill.toLowerCase()))
    );
    
    const matchedPreferred = roleRequirements.preferred.filter(skill =>
        userSkillsLower.some(uSkill => uSkill.includes(skill.toLowerCase()))
    );
    
    const missingPreferred = roleRequirements.preferred.filter(skill =>
        !userSkillsLower.some(uSkill => uSkill.includes(skill.toLowerCase()))
    );
    
    // Calculate readiness
    const requiredProgress = (matchedRequired.length / roleRequirements.required.length) * 100;
    const preferredProgress = (matchedPreferred.length / roleRequirements.preferred.length) * 100;
    const overallReadiness = (requiredProgress * 0.7 + preferredProgress * 0.3);
    
    return {
        targetRole,
        requiredSkills: roleRequirements.required,
        preferredSkills: roleRequirements.preferred,
        matchedRequired,
        missingRequired,
        matchedPreferred,
        missingPreferred,
        requiredProgress: Math.round(requiredProgress),
        preferredProgress: Math.round(preferredProgress),
        overallReadiness: Math.round(overallReadiness),
        jobMarketInfo: {
            salary: roleRequirements.salary,
            experience: roleRequirements.experience,
            demand: "HIGH 🔥"
        },
        recommendation: generateRecommendation(overallReadiness, missingRequired),
        learningPath: generateLearningPath(missingRequired, missingPreferred)
    };
};

const generateRecommendation = (readiness, missingRequired) => {
    if (readiness >= 80) {
        return "🟢 You're READY! Start applying now! Your skills match the role perfectly.";
    } else if (readiness >= 60) {
        return "🟡 Almost ready! Learn the missing required skills (2-3 weeks of focused learning).";
    } else if (readiness >= 40) {
        return "🟠 You need more preparation. Focus on required skills first (1-2 months).";
    } else {
        return "🔴 Start from basics. Build foundational skills then move to specialized ones (3-6 months).";
    }
};

const generateLearningPath = (missingRequired, missingPreferred) => {
    const path = [];
    
    if (missingRequired.length > 0) {
        path.push({
            phase: "Phase 1: Required Skills (Priority)",
            duration: "2-4 weeks",
            skills: missingRequired,
            resources: {
                courses: "Udemy, FreeCodeCamp, Coursera",
                practice: "LeetCode, HackerRank, build projects"
            }
        });
    }
    
    if (missingPreferred.length > 0) {
        path.push({
            phase: "Phase 2: Preferred Skills (Enhancement)",
            duration: "1-2 weeks",
            skills: missingPreferred,
            resources: {
                courses: "Advanced courses, documentation",
                practice: "Real projects, open source"
            }
        });
    }
    
    path.push({
        phase: "Phase 3: Application & Interview",
        duration: "Ongoing",
        actions: ["Build 2-3 portfolio projects", "Practice DSA", "Mock interviews", "Apply to jobs"]
    });
    
    return path;
};

export const getAvailableRoles = () => {
    return Object.keys(skillRequirements);
};
