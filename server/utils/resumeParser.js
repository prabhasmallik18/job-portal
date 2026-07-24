// Resume Parser - Extracts skills from resume text
export const parseResumeSkills = (resumeText) => {
    const resumeLower = resumeText.toLowerCase();
    
    // Common tech skills database
    const skillsDatabase = {
        frontend: ['react', 'vue', 'angular', 'html', 'css', 'javascript', 'typescript', 'tailwind', 'bootstrap', 'jquery', 'webpack', 'vite'],
        backend: ['node.js', 'node', 'express', 'python', 'django', 'flask', 'java', 'spring', 'c#', '.net', 'php', 'rails', 'ruby'],
        database: ['mongodb', 'mysql', 'postgresql', 'sql', 'firebase', 'dynamodb', 'cassandra', 'redis', 'oracle'],
        devops: ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'git', 'ci/cd', 'jenkins', 'gitlab', 'github actions'],
        tools: ['git', 'github', 'jira', 'slack', 'figma', 'postman', 'vs code', 'linux', 'npm', 'yarn'],
        soft: ['leadership', 'communication', 'teamwork', 'problem solving', 'project management', 'agile', 'scrum']
    };
    
    const foundSkills = {};
    
    // Extract skills
    for (const [category, skills] of Object.entries(skillsDatabase)) {
        foundSkills[category] = skills.filter(skill => resumeLower.includes(skill));
    }
    
    // Flatten all found skills
    const allSkills = Object.values(foundSkills).flat();
    
    // Extract experience years
    const yearsMatch = resumeText.match(/(\d+)\s*(?:years?|yrs?)/i);
    const experienceYears = yearsMatch ? parseInt(yearsMatch[1]) : 0;
    
    return {
        skills: allSkills,
        skillsByCategory: foundSkills,
        experienceYears,
        totalSkillsFound: allSkills.length,
        atsScore: Math.min(100, (allSkills.length * 3 + experienceYears * 5))
    };
};

// Generate Resume Feedback
export const generateResumeFeedback = (skillsData) => {
    const feedback = [];
    
    if (skillsData.skillsByCategory.frontend.length === 0) {
        feedback.push("❌ Add frontend skills (React, Vue, Angular)");
    }
    if (skillsData.skillsByCategory.backend.length === 0) {
        feedback.push("❌ Add backend skills (Node.js, Python, Java)");
    }
    if (skillsData.skillsByCategory.database.length === 0) {
        feedback.push("❌ Add database skills (MongoDB, SQL)");
    }
    if (skillsData.experienceYears < 1) {
        feedback.push("⚠️ Add project experience/internships");
    }
    if (skillsData.totalSkillsFound < 10) {
        feedback.push("⚠️ Add more technologies to your resume");
    }
    
    if (feedback.length === 0) {
        feedback.push("✅ Resume looks great! Solid skill set!");
    }
    
    return feedback;
};
