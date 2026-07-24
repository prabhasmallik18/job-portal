import mongoose from 'mongoose'
import 'dotenv/config'
import Company from './models/Company.js'
import Job from './models/job.js'
import bcrypt from 'bcrypt'

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to MongoDB')

        await Company.deleteMany({})
        await Job.deleteMany({})
        
        const hashedPasswords = [];
        const plainPasswords = ['tech@123', 'digital@123', 'cloud@123', 'quantum@123', 'neural@123', 'nextgen@123', 'datapulse@123', 'secure@123'];
        
        for (let pwd of plainPasswords) {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(pwd, salt);
            hashedPasswords.push(hashed);
        }
        
        let companies = await Company.insertMany([
            {
                name: 'Tech Solutions Inc',
                email: 'tech@techsolutions.com',
                password: hashedPasswords[0],
                image: '/logos/techsolutions_logo.svg'
            },
            {
                name: 'Digital Innovators',
                email: 'hr@digitalinnovators.com',
                password: hashedPasswords[1],
                image: '/logos/digitalinnovators_logo.svg'
            },
            {
                name: 'Cloud Infrastructure Ltd',
                email: 'careers@cloudinfra.com',
                password: hashedPasswords[2],
                image: '/logos/cloudinfra_logo.svg'
            },
            {
                name: 'Quantum Systems Corp',
                email: 'jobs@quantumsys.com',
                password: hashedPasswords[3],
                image: '/logos/quantum_logo.svg'
            },
            {
                name: 'NeuralSync Technologies',
                email: 'career@neuralsync.com',
                password: hashedPasswords[4],
                image: '/logos/neuralsync_logo.svg'
            },
            {
                name: 'NextGen Software',
                email: 'hr@nextgensw.com',
                password: hashedPasswords[5],
                image: '/logos/nextgen_logo.svg'
            },
            {
                name: 'DataPulse Analytics',
                email: 'recruit@datapulse.com',
                password: hashedPasswords[6],
                image: '/logos/datapulse_logo.svg'
            },
            {
                name: 'SecureNet Solutions',
                email: 'careers@securenet.com',
                password: hashedPasswords[7],
                image: '/logos/securenet_logo.svg'
            }
        ])
        console.log('✅ Created sample companies:', companies.length)

        // Define all job templates by category
        const categories = ['Programming', 'Data Science', 'Designing', 'Networking', 'Management', 'Marketing', 'Cybersecurity'];
        const locations = ['Bangalore', 'Washington', 'Hyderabad', 'Mumbai', 'California', 'Chennai', 'New York'];
        const levels = ['Beginner level', 'Intermediate level', 'Senior level'];

        const jobTemplates = {
            'Programming': [
                {
                    title: 'Senior Full Stack Developer',
                    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Docker'],
                    description: '<p>We are seeking an experienced Full Stack Developer to lead our technology initiatives.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Design and implement scalable web applications</li><li>Lead technical discussions and code reviews</li><li>Mentor junior developers</li><li>Optimize application performance</li></ul>',
                    level: 'Senior level',
                    salary: 150000
                },
                {
                    title: 'Backend Developer (Node.js)',
                    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs'],
                    description: '<p>Join our backend team to build robust APIs and services.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Develop and maintain RESTful APIs</li><li>Design database schemas</li><li>Implement caching strategies</li><li>Write unit and integration tests</li></ul>',
                    level: 'Intermediate level',
                    salary: 110000
                },
                {
                    title: 'Frontend Developer (React)',
                    skills: ['React', 'JavaScript', 'CSS', 'Tailwind CSS', 'Redux'],
                    description: '<p>Build responsive and interactive user interfaces.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Develop React components</li><li>Implement responsive design</li><li>Optimize component performance</li><li>Collaborate with UX designers</li></ul>',
                    level: 'Intermediate level',
                    salary: 105000
                },
                {
                    title: 'Junior Python Developer',
                    skills: ['Python', 'Django', 'HTML', 'CSS', 'Git'],
                    description: '<p>Start your career as a Python developer.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Develop web applications</li><li>Write clean and maintainable code</li><li>Participate in code reviews</li><li>Learn best practices</li></ul>',
                    level: 'Beginner level',
                    salary: 70000
                },
                {
                    title: 'Python Developer',
                    skills: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Git'],
                    description: '<p>Develop robust backend solutions using Python.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Build Django/FastAPI applications</li><li>Write efficient Python code</li><li>Implement database migrations</li><li>Deploy applications</li></ul>',
                    level: 'Intermediate level',
                    salary: 100000
                },
                {
                    title: 'DevOps Engineer',
                    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
                    description: '<p>Manage and optimize our cloud infrastructure.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Set up CI/CD pipelines</li><li>Manage Docker containers</li><li>Monitor system performance</li><li>Implement security measures</li></ul>',
                    level: 'Senior level',
                    salary: 140000
                }
            ],
            'Data Science': [
                {
                    title: 'Senior Data Scientist',
                    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Statistics'],
                    description: '<p>Lead advanced ML projects and drive data-driven decisions.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Develop machine learning models</li><li>Conduct statistical analysis</li><li>Guide junior data scientists</li><li>Present insights to stakeholders</li></ul>',
                    level: 'Senior level',
                    salary: 160000
                },
                {
                    title: 'Data Scientist',
                    skills: ['Python', 'Pandas', 'Scikit-learn', 'SQL', 'Matplotlib'],
                    description: '<p>Join our data team and work on impactful ML projects.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Build predictive models</li><li>Perform exploratory data analysis</li><li>Create data visualizations</li><li>Optimize model performance</li></ul>',
                    level: 'Intermediate level',
                    salary: 120000
                },
                {
                    title: 'Junior Data Scientist',
                    skills: ['Python', 'Statistics', 'SQL', 'Excel', 'Data Visualization'],
                    description: '<p>Start your data science career with mentorship.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Assist in data analysis</li><li>Clean and prepare datasets</li><li>Support ML model development</li><li>Learn data science techniques</li></ul>',
                    level: 'Beginner level',
                    salary: 75000
                },
                {
                    title: 'ML Engineer',
                    skills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'Computer Vision'],
                    description: '<p>Develop and deploy machine learning solutions.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Implement deep learning models</li><li>Deploy ML pipelines</li><li>Optimize model inference</li><li>Collaborate with data teams</li></ul>',
                    level: 'Senior level',
                    salary: 155000
                },
                {
                    title: 'Data Analyst',
                    skills: ['SQL', 'Python', 'Tableau', 'Excel', 'Statistics'],
                    description: '<p>Analyze data and create actionable insights.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Query databases</li><li>Create dashboards</li><li>Report on key metrics</li><li>Support business decisions</li></ul>',
                    level: 'Intermediate level',
                    salary: 95000
                },
                {
                    title: 'Analytics Engineer',
                    skills: ['SQL', 'dbt', 'Looker', 'Python', 'Data Warehousing'],
                    description: '<p>Build data infrastructure and analytics solutions.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Design data models</li><li>Build dbt pipelines</li><li>Create business metrics</li><li>Support analytics teams</li></ul>',
                    level: 'Intermediate level',
                    salary: 115000
                }
            ],
            'Designing': [
                {
                    title: 'Senior UX/UI Designer',
                    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility'],
                    description: '<p>Lead design initiatives and shape product experience.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Create design systems</li><li>Conduct user research</li><li>Design user experiences</li><li>Mentor junior designers</li></ul>',
                    level: 'Senior level',
                    salary: 130000
                },
                {
                    title: 'UI Designer',
                    skills: ['Figma', 'Adobe XD', 'Sketch', 'CSS', 'Design Principles'],
                    description: '<p>Create beautiful user interfaces for our products.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Design UI mockups</li><li>Create design specifications</li><li>Collaborate with developers</li><li>Maintain design consistency</li></ul>',
                    level: 'Intermediate level',
                    salary: 100000
                },
                {
                    title: 'Product Designer',
                    skills: ['Figma', 'User Research', 'Product Strategy', 'Prototyping', 'Analytics'],
                    description: '<p>Design products from concept to launch.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Create user flows</li><li>Design wireframes and mockups</li><li>Conduct usability testing</li><li>Iterate based on feedback</li></ul>',
                    level: 'Intermediate level',
                    salary: 105000
                },
                {
                    title: 'Junior UI Designer',
                    skills: ['Figma', 'Adobe Creative Suite', 'Design Basics', 'Typography', 'Color Theory'],
                    description: '<p>Start your design career with us.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Assist senior designers</li><li>Create design assets</li><li>Learn design tools</li><li>Support design projects</li></ul>',
                    level: 'Beginner level',
                    salary: 70000
                },
                {
                    title: 'Graphic Designer',
                    skills: ['Adobe Creative Suite', 'Typography', 'Branding', 'Illustration', 'Print Design'],
                    description: '<p>Create stunning visual designs and marketing materials.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Design marketing materials</li><li>Create brand assets</li><li>Design infographics</li><li>Support creative direction</li></ul>',
                    level: 'Intermediate level',
                    salary: 80000
                },
                {
                    title: 'Motion Graphics Designer',
                    skills: ['After Effects', 'Cinema 4D', 'Animation', 'Adobe Suite', 'Video Editing'],
                    description: '<p>Create compelling motion graphics and animations.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Design animations</li><li>Create video graphics</li><li>Produce visual effects</li><li>Collaborate on multimedia projects</li></ul>',
                    level: 'Senior level',
                    salary: 120000
                }
            ],
            'Networking': [
                {
                    title: 'Senior Network Architect',
                    skills: ['Network Design', 'Cisco', 'Routing & Switching', 'Security', 'Cloud Networking'],
                    description: '<p>Design and manage enterprise network infrastructure.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Design network solutions</li><li>Plan network upgrades</li><li>Ensure network security</li><li>Lead technical teams</li></ul>',
                    level: 'Senior level',
                    salary: 145000
                },
                {
                    title: 'Network Engineer',
                    skills: ['Cisco', 'Routing', 'Switching', 'Firewalls', 'TCP/IP'],
                    description: '<p>Manage and maintain network infrastructure.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Configure network devices</li><li>Monitor network performance</li><li>Troubleshoot network issues</li><li>Maintain network security</li></ul>',
                    level: 'Intermediate level',
                    salary: 110000
                },
                {
                    title: 'Cloud Network Engineer',
                    skills: ['AWS', 'Azure', 'Networking', 'VPC', 'Load Balancing'],
                    description: '<p>Build and manage cloud network infrastructure.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Configure cloud networks</li><li>Set up VPN connections</li><li>Manage firewalls</li><li>Optimize network performance</li></ul>',
                    level: 'Intermediate level',
                    salary: 115000
                },
                {
                    title: 'Junior Network Administrator',
                    skills: ['Networking Basics', 'TCP/IP', 'Windows Server', 'Linux', 'Troubleshooting'],
                    description: '<p>Support network operations and maintenance.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Monitor network systems</li><li>Assist with configurations</li><li>Support helpdesk</li><li>Learn networking concepts</li></ul>',
                    level: 'Beginner level',
                    salary: 65000
                },
                {
                    title: 'Data Center Network Specialist',
                    skills: ['Data Center Networking', 'Fiber Optics', 'Load Balancing', 'Virtualization', 'Monitoring'],
                    description: '<p>Manage data center network operations.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Manage data center networks</li><li>Monitor network traffic</li><li>Optimize performance</li><li>Maintain redundancy</li></ul>',
                    level: 'Senior level',
                    salary: 135000
                },
                {
                    title: 'Network Security Specialist',
                    skills: ['Network Security', 'IDS/IPS', 'VPN', 'Firewalls', 'Threat Analysis'],
                    description: '<p>Secure our network infrastructure from threats.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Monitor network security</li><li>Implement security measures</li><li>Respond to threats</li><li>Maintain compliance</li></ul>',
                    level: 'Intermediate level',
                    salary: 120000
                }
            ],
            'Management': [
                {
                    title: 'Technical Project Manager',
                    skills: ['Project Management', 'Agile', 'Leadership', 'Communication', 'Risk Management'],
                    description: '<p>Lead technical projects from planning to delivery.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Plan and execute projects</li><li>Manage stakeholders</li><li>Monitor project progress</li><li>Ensure quality delivery</li></ul>',
                    level: 'Senior level',
                    salary: 130000
                },
                {
                    title: 'Engineering Manager',
                    skills: ['Team Leadership', 'Technical Knowledge', 'Performance Management', 'Strategic Planning', 'Communication'],
                    description: '<p>Manage and develop engineering teams.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Lead engineering teams</li><li>Perform team reviews</li><li>Plan development strategy</li><li>Mentor team members</li></ul>',
                    level: 'Senior level',
                    salary: 140000
                },
                {
                    title: 'Scrum Master',
                    skills: ['Scrum', 'Agile', 'Team Facilitation', 'Problem Solving', 'Coaching'],
                    description: '<p>Facilitate agile development processes.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Run daily standups</li><li>Manage sprints</li><li>Remove blockers</li><li>Coach teams on agile</li></ul>',
                    level: 'Intermediate level',
                    salary: 95000
                },
                {
                    title: 'Product Manager',
                    skills: ['Product Strategy', 'Analytics', 'User Research', 'Roadmapping', 'Communication'],
                    description: '<p>Define product vision and strategy.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Create product roadmap</li><li>Analyze user needs</li><li>Define requirements</li><li>Drive product delivery</li></ul>',
                    level: 'Senior level',
                    salary: 125000
                },
                {
                    title: 'HR Manager',
                    skills: ['HR Management', 'Recruitment', 'Employee Relations', 'Compliance', 'Communication'],
                    description: '<p>Manage human resources and team development.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Recruit and hire talent</li><li>Manage employee relations</li><li>Handle compensation</li><li>Ensure compliance</li></ul>',
                    level: 'Intermediate level',
                    salary: 85000
                },
                {
                    title: 'Operations Manager',
                    skills: ['Operations', 'Process Improvement', 'Analytics', 'Leadership', 'Problem Solving'],
                    description: '<p>Optimize business operations and processes.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Streamline operations</li><li>Improve efficiency</li><li>Manage teams</li><li>Report metrics</li></ul>',
                    level: 'Senior level',
                    salary: 110000
                }
            ],
            'Marketing': [
                {
                    title: 'Senior Marketing Manager',
                    skills: ['Digital Marketing', 'Strategy', 'Analytics', 'Leadership', 'Campaign Management'],
                    description: '<p>Lead marketing strategy and campaigns.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Develop marketing strategy</li><li>Manage marketing teams</li><li>Oversee campaigns</li><li>Analyze marketing metrics</li></ul>',
                    level: 'Senior level',
                    salary: 120000
                },
                {
                    title: 'Digital Marketing Specialist',
                    skills: ['Social Media', 'SEO', 'Content Marketing', 'Analytics', 'Email Marketing'],
                    description: '<p>Manage digital marketing campaigns.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Create content strategy</li><li>Manage social media</li><li>Run email campaigns</li><li>Analyze performance</li></ul>',
                    level: 'Intermediate level',
                    salary: 80000
                },
                {
                    title: 'Content Manager',
                    skills: ['Content Writing', 'SEO', 'Social Media', 'Content Strategy', 'Analytics'],
                    description: '<p>Create and manage content across platforms.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Write engaging content</li><li>Manage content calendar</li><li>Optimize for SEO</li><li>Manage social platforms</li></ul>',
                    level: 'Intermediate level',
                    salary: 75000
                },
                {
                    title: 'Junior Marketing Executive',
                    skills: ['Social Media', 'Content Writing', 'Analytics', 'Excel', 'Communication'],
                    description: '<p>Support marketing operations and campaigns.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Support campaigns</li><li>Create social content</li><li>Manage calendars</li><li>Learn marketing practices</li></ul>',
                    level: 'Beginner level',
                    salary: 60000
                },
                {
                    title: 'Growth Hacker',
                    skills: ['Growth Marketing', 'Analytics', 'Experimentation', 'SQL', 'Data Analysis'],
                    description: '<p>Drive rapid business growth through creative marketing.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Identify growth opportunities</li><li>Run experiments</li><li>Analyze data</li><li>Optimize conversions</li></ul>',
                    level: 'Senior level',
                    salary: 110000
                },
                {
                    title: 'Brand Manager',
                    skills: ['Brand Strategy', 'Marketing', 'Communication', 'Analytics', 'Creativity'],
                    description: '<p>Build and manage brand identity and strategy.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Develop brand strategy</li><li>Manage brand messaging</li><li>Monitor brand health</li><li>Lead brand campaigns</li></ul>',
                    level: 'Senior level',
                    salary: 105000
                }
            ],
            'Cybersecurity': [
                {
                    title: 'Senior Security Architect',
                    skills: ['Security Architecture', 'Network Security', 'Cloud Security', 'Compliance', 'Risk Management'],
                    description: '<p>Design and implement comprehensive security solutions.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Design security architecture</li><li>Assess security risks</li><li>Implement security controls</li><li>Lead security strategy</li></ul>',
                    level: 'Senior level',
                    salary: 160000
                },
                {
                    title: 'Penetration Tester',
                    skills: ['Ethical Hacking', 'Penetration Testing', 'Security Tools', 'Networking', 'Scripting'],
                    description: '<p>Test systems for security vulnerabilities.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Conduct security tests</li><li>Identify vulnerabilities</li><li>Report findings</li><li>Recommend fixes</li></ul>',
                    level: 'Senior level',
                    salary: 150000
                },
                {
                    title: 'Security Engineer',
                    skills: ['Network Security', 'Firewalls', 'Intrusion Detection', 'Incident Response', 'Monitoring'],
                    description: '<p>Implement and maintain security systems.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Manage firewalls</li><li>Monitor security events</li><li>Respond to incidents</li><li>Implement security patches</li></ul>',
                    level: 'Intermediate level',
                    salary: 120000
                },
                {
                    title: 'Junior Security Analyst',
                    skills: ['Security Monitoring', 'Log Analysis', 'Incident Response', 'Linux', 'Networking'],
                    description: '<p>Support security operations and monitoring.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Monitor security alerts</li><li>Analyze logs</li><li>Support incident response</li><li>Learn security tools</li></ul>',
                    level: 'Beginner level',
                    salary: 70000
                },
                {
                    title: 'Compliance Officer',
                    skills: ['Compliance', 'Regulations', 'Auditing', 'Risk Assessment', 'Documentation'],
                    description: '<p>Ensure organizational compliance with security regulations.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Manage compliance programs</li><li>Conduct audits</li><li>Document policies</li><li>Report to leadership</li></ul>',
                    level: 'Senior level',
                    salary: 125000
                },
                {
                    title: 'SOC Analyst',
                    skills: ['SIEM', 'Threat Analysis', 'Incident Response', 'Monitoring', 'Networking'],
                    description: '<p>Monitor and respond to security threats 24/7.</p><p><strong>Key Responsibilities:</strong></p><ul><li>Monitor security events</li><li>Analyze threats</li><li>Respond to incidents</li><li>Generate reports</li></ul>',
                    level: 'Intermediate level',
                    salary: 105000
                }
            ]
        };

        // Create jobs across all categories and locations
        const jobs = [];
        let jobCounter = 0;

        for (let categoryIdx = 0; categoryIdx < categories.length; categoryIdx++) {
            const category = categories[categoryIdx];
            const templates = jobTemplates[category];

            if (!templates) continue;

            for (let locIdx = 0; locIdx < locations.length; locIdx++) {
                const location = locations[locIdx];
                const templateIdx = jobCounter % templates.length;
                const template = templates[templateIdx];
                const company = companies[jobCounter % companies.length];

                jobs.push({
                    title: template.title,
                    description: template.description,
                    location: location,
                    category: category,
                    level: template.level,
                    salary: template.salary + (Math.random() * 20000),
                    skills: template.skills,
                    companyId: company._id,
                    date: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
                    visible: true
                });

                jobCounter++;
            }
        }

        await Job.insertMany(jobs);
        console.log(`✅ Created ${jobs.length} sample jobs across all categories and locations`)

        console.log('\n✨ Database seeding completed successfully!')
        console.log(`📊 Statistics:`)
        console.log(`   - Categories: ${categories.length}`)
        console.log(`   - Locations: ${locations.length}`)
        console.log(`   - Companies: ${companies.length}`)
        console.log(`   - Total Jobs: ${jobs.length}`)
        
        console.log('\n🔐 Recruiter Login Credentials:')
        console.log('─────────────────────────────────────')
        plainPasswords.forEach((pwd, i) => {
            console.log(`${i + 1}. ${companies[i].email} | Password: ${pwd}`)
        })
        console.log('─────────────────────────────────────')
        
        console.log('\n📍 Available Locations:')
        locations.forEach(loc => console.log(`   • ${loc}`))
        
        console.log('\n🏢 Available Categories:')
        categories.forEach(cat => console.log(`   • ${cat}`))
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error)
        process.exit(1)
    }
}

seedDatabase()
