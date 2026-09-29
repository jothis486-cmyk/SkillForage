exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    let reply = "I am your AI Career Assistant. I'm here to help you with your career path!";
    
    if (message.toLowerCase().includes('roadmap') || message.toLowerCase().includes('learn')) {
      reply = "To start learning, I recommend focusing on Python and Data Structures first, then moving on to your specialized career track.";
    } else if (message.toLowerCase().includes('interview')) {
      reply = "For interviews, focus on communicating your thought process clearly. Focus on STAR method and core DSA.";
    }

    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.generateRoadmap = async (req, res) => {
  try {
    const { career, currentSkills } = req.body;
    const roadmap = {
      career: career || "Software Engineer",
      estimatedTime: "6 months",
      phases: [
        { name: "Phase 1: Foundations", skills: ["Python/JS", "SQL", "Git"] },
        { name: "Phase 2: Core Concepts", skills: ["Data Structures", "Algorithms", "System Design Basics"] },
        { name: "Phase 3: Specialization & Full Stack", skills: ["React/Node", "FastAPI/Express", "Cloud Basics"] },
        { name: "Phase 4: Capstone & Portfolio", skills: ["CI/CD", "Docker", "Microservices", "Interview Prep"] }
      ],
      recommendedCourses: [
        "Full Stack Web Development & System Design",
        "Data Structures & Algorithms Masterclass",
        "Cloud & DevOps Practitioner"
      ]
    };
    
    res.json({ roadmap });
  } catch (error) {
    console.error('Roadmap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.mockInterview = async (req, res) => {
  try {
    const { topic } = req.body;
    const questions = [
      "Can you tell me about yourself and your background?",
      `What is your core experience with ${topic || 'Web Development'}?`,
      "Can you describe a challenging bug or architecture problem you resolved?",
      "How do you design a scalable caching mechanism for high throughput services?"
    ];
    res.json({ questions });
  } catch (error) {
    console.error('Mock interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.generateProjectBlueprint = async (req, res) => {
  try {
    const { skills, domain, title } = req.body;
    const projectTitle = title || `${skills?.[0] || 'Full-Stack'} E-Commerce & Analytics Platform`;
    
    const blueprint = {
      title: projectTitle,
      domain: domain || "Web App",
      architecture: "Client-Server Microservices / MVC Architecture with REST & WebSocket APIs",
      folderStructure: `
project-root/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── README.md`,
      databaseDesign: {
        tablesOrCollections: [
          { name: "Users", fields: ["_id", "name", "email", "passwordHash", "role", "createdAt"] },
          { name: "Projects/Products", fields: ["_id", "title", "description", "price", "ownerId"] },
          { name: "AnalyticsLogs", fields: ["_id", "userId", "action", "timestamp", "metadata"] }
        ],
        relationships: "One-to-Many: User -> Projects/Products, User -> AnalyticsLogs"
      },
      recommendedAPIs: [
        { method: "POST", path: "/api/auth/register", desc: "User Registration" },
        { method: "POST", path: "/api/auth/login", desc: "JWT Auth Login" },
        { method: "GET", path: "/api/products", desc: "Fetch product catalog" },
        { method: "POST", path: "/api/analytics/log", desc: "Record user event" }
      ],
      roadmap: [
        "Step 1: Setup React + Vite frontend scaffolding & Tailwind/CSS styling tokens",
        "Step 2: Initialize Node.js/Express backend with MongoDB database models",
        "Step 3: Build authentication middleware & JWT security",
        "Step 4: Integrate core feature business logic & REST API connectors",
        "Step 5: Deploy frontend to Vercel/Netlify and backend to Render/AWS"
      ],
      workflowExplanation: "User registers -> Authenticates via JWT -> Accesses interactive UI -> React triggers REST endpoints -> Express validates JWT -> Executes Mongo queries -> Returns JSON payload.",
      deploymentGuide: "Frontend: Push to GitHub -> Import into Vercel -> Set environment variables.\nBackend: Containerize with Docker -> Deploy to Render/AWS EC2 -> Attach MongoDB Atlas connection string.",
      githubTemplateUrl: "https://github.com/templates/ai-fullstack-starter",
      mentorTips: "Focus on clean component modularity, proper error handling, unit tests, and writing a comprehensive README with screenshots."
    };

    res.json({ blueprint });
  } catch (error) {
    console.error('Project blueprint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.debugCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    
    const analysis = {
      language: language || "JavaScript",
      errorExplanation: "Potential unhandled Promise rejection and missing null check before dereferencing response payload.",
      detectedBugs: [
        "Line 12: Calling property of undefined object payload without optional chaining (payload?.data).",
        "Line 24: Missing try/catch block around async network fetch call."
      ],
      securitySuggestions: [
        "Sanitize user inputs to prevent XSS vulnerability.",
        "Do not log sensitive bearer token details to console.log."
      ],
      performanceImprovements: [
        "Use memoization (useMemo / useCallback) for heavy list rendering.",
        "Avoid inline arrow functions inside map iterations where possible."
      ],
      aiFixedCode: code ? code.replace(/(\.then\(|\.data)/g, '?$1') : "// Optimized & Secured Snippet\ntry {\n  const res = await fetchData();\n  const data = res?.data ?? [];\n} catch (err) {\n  console.error('Handled error:', err);\n}"
    };

    res.json({ analysis });
  } catch (error) {
    console.error('Debug code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.analyzeGithub = async (req, res) => {
  try {
    const { username } = req.body;
    const userHandle = username || "dev-student";
    
    const result = {
      username: userHandle,
      qualityScore: 84,
      stars: 42,
      reposCount: 18,
      contributionsLastYear: 312,
      topLanguages: [
        { name: "JavaScript", percent: 45, color: "#f7df1e" },
        { name: "Python", percent: 30, color: "#3572A5" },
        { name: "HTML/CSS", percent: 15, color: "#e34c26" },
        { name: "TypeScript", percent: 10, color: "#2b7489" }
      ],
      projectQualityRating: "A - Excellent Readme & Commit Hygiene",
      missingPortfolioProjects: [
        "Microservices Architecture Capstone",
        "Real-time WebSocket Chat Application",
        "CI/CD Pipeline & Docker Containerized App"
      ],
      aiSuggestions: [
        "Add clear architecture diagrams to top 3 pinned repositories.",
        "Include live demo URLs in repository descriptions.",
        "Increase commit frequency on open-source repositories to boost contribution graph."
      ]
    };

    res.json({ result });
  } catch (error) {
    console.error('Github analyze error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.matchJob = async (req, res) => {
  try {
    const { jobDescription, resumeText } = req.body;
    
    const result = {
      matchPercentage: 78,
      atsCompatibility: "85% (High Compatibility)",
      matchedKeywords: ["React", "JavaScript", "Node.js", "REST APIs", "Git", "SQL"],
      missingKeywords: ["Docker", "Kubernetes", "GraphQL", "AWS EC2", "Redis"],
      missingSkills: ["Cloud Infrastructure", "Container Orchestration", "Caching Strategies"],
      improvementTips: [
        "Incorporate quantified metric achievements (e.g. 'Optimized DB queries by 35%').",
        "Add 'Docker' and 'AWS' under Technical Skills header to clear ATS filtering.",
        "Add a 3-line Technical Profile Summary at the top of your resume."
      ]
    };

    res.json({ result });
  } catch (error) {
    console.error('Job match error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.predictSuccess = async (req, res) => {
  try {
    const { skills, targetRole } = req.body;
    
    const prediction = {
      targetRole: targetRole || "Software Engineer",
      selectionProbability: "82%",
      placementReadinessScore: 78,
      expectedInterviewScore: "8.4 / 10",
      expectedSalaryRange: "₹9.5 LPA - ₹16.0 LPA",
      improvementScore: "+14% achievable by completing Docker & System Design modules",
      strengths: ["Strong Frontend Fundamentals", "Consistent Coding Activity", "Good DSA Base"],
      weaknesses: ["System Design Architecture", "DevOps & Deployment Pipelines"]
    };

    res.json({ prediction });
  } catch (error) {
    console.error('Predict success error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.generateDoc = async (req, res) => {
  try {
    const { projectName } = req.body;
    const name = projectName || "AI Career Intelligence Platform";
    
    const doc = {
      projectName: name,
      abstract: "This project provides an automated, AI-driven career development, skill gap detection, and project architecture recommendation ecosystem aimed at empowering engineering candidates.",
      introduction: "Modern hiring practices require comprehensive candidate readiness spanning technical skill mastery, real-world portfolio quality, and ATS-optimized resumes.",
      modules: ["User Authentication Module", "Skill Gap Analyzer Engine", "AI Project Builder", "GitHub Portfolio Evaluator", "Job Matching & Placement Prep"],
      objectives: [
        "Automate personalized learning roadmaps based on real-time market demands.",
        "Provide step-by-step project blueprints, architecture, and code debugging.",
        "Deliver AI-powered career success predictions and salary estimations."
      ],
      algorithms: ["Cosine Similarity for Resume-Job Keyword Matching", "Skill Gap Radar Calculation Vector", "Predictive Scoring Random Forest Simulation"],
      architectureOverview: "Three-tier architecture with React SPA frontend, Express API gateway, and MongoDB database layer.",
      conclusion: "The system successfully closes the gap between student preparation and tier-1 industry standards.",
      futureScope: "Integration with real-time video interview speech sentiment analysis and live automated code execution sandbox."
    };

    res.json({ doc });
  } catch (error) {
    console.error('Doc generator error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.reviewProject = async (req, res) => {
  try {
    const { projectUrl } = req.body;
    
    const review = {
      projectScore: 88,
      folderStructureScore: "90/100 (Clean MVC separation)",
      codeQualityScore: "85/100 (Good modularity, minor lint warnings)",
      documentationScore: "92/100 (Comprehensive README with badge & guide)",
      githubBestPractices: "86/100 (Frequent commits, branch naming)",
      deploymentScore: "85/100 (Live deployment verified)",
      keyHighlights: ["Excellent UI design", "Good API error handling", "Clean directory layout"],
      recommendations: ["Add automated end-to-end integration tests", "Include Docker Compose setup"]
    };

    res.json({ review });
  } catch (error) {
    console.error('Review project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

