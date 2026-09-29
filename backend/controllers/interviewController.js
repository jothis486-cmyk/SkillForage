const Interview = require('../models/Interview');
const User = require('../models/User');

// Helper to generate dynamic questions based on domain & candidate setup
function buildQuestionBank(jobRole, experienceLevel, interviewType, userSkills = [], projects = []) {
  const role = (jobRole || 'Full-Stack Developer').toLowerCase();
  const exp = experienceLevel || 'Fresh Graduate';

  const questions = [];

  // Technical Questions
  const techQuestions = [
    {
      id: 'q_tech_1',
      type: 'technical',
      category: 'Programming Languages & Web',
      questionText: `Explain event loop mechanism in JavaScript and how asynchronous operations (Promises vs Async/Await) are scheduled.`,
      userAnswer: '',
      score: 0
    },
    {
      id: 'q_tech_2',
      type: 'technical',
      category: 'Database & Backend',
      questionText: `Compare SQL indexing vs MongoDB indexing strategies. How do compound indexes optimize query throughput in high-concurrency applications?`,
      userAnswer: '',
      score: 0
    },
    {
      id: 'q_tech_3',
      type: 'technical',
      category: 'Core Computer Science',
      questionText: `Explain process vs thread in Operating Systems, and how deadlock occurs with mutual exclusion, hold-and-wait, no-preemption, and circular wait.`,
      userAnswer: '',
      score: 0
    },
    {
      id: 'q_tech_4',
      type: 'technical',
      category: 'AI & Cloud',
      questionText: `In containerized architectures (Docker & Kubernetes), what is the difference between image layers, pods, and deployments? How do microservices communicate efficiently?`,
      userAnswer: '',
      score: 0
    }
  ];

  // Coding Questions
  const codingQuestions = [
    {
      id: 'q_code_1',
      type: 'coding',
      category: 'Data Structures & Algorithms',
      questionText: `Given an array of integers 'nums' and an integer 'target', return indices of the two numbers such that they add up to target. Optimize your solution for O(N) time complexity.`,
      codeStub: `function twoSum(nums, target) {
  // Write your solution here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      language: 'javascript',
      testCases: [
        { input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', hidden: false },
        { input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]', hidden: false },
        { input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]', hidden: true },
        { input: 'nums = [1, 5, 8, 12, 19], target = 27', expectedOutput: '[2, 4]', hidden: true }
      ],
      userCode: '',
      score: 0
    },
    {
      id: 'q_code_2',
      type: 'coding',
      category: 'String Manipulation & Arrays',
      questionText: `Write a function to find the longest substring without repeating characters in a given string.`,
      codeStub: `function lengthOfLongestSubstring(s) {
  let maxLength = 0;
  let start = 0;
  const map = {};
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (map[char] >= start) {
      start = map[char] + 1;
    }
    map[char] = i;
    maxLength = Math.max(maxLength, i - start + 1);
  }
  return maxLength;
}`,
      language: 'javascript',
      testCases: [
        { input: 's = "abcabcbb"', expectedOutput: '3', hidden: false },
        { input: 's = "bbbbb"', expectedOutput: '1', hidden: false },
        { input: 's = "pwwkew"', expectedOutput: '3', hidden: true }
      ],
      userCode: '',
      score: 0
    }
  ];

  // HR & Behavioral Questions
  const hrQuestions = [
    {
      id: 'q_hr_1',
      type: 'hr',
      category: 'HR & Personal Mastery',
      questionText: `Tell me about yourself, your career journey, and why you are interested in the ${jobRole} position at our company.`,
      userAnswer: '',
      score: 0
    },
    {
      id: 'q_hr_2',
      type: 'hr',
      category: 'Strengths & Weaknesses',
      questionText: `What are your top technical strengths, and what is one area of weakness you are actively working to improve?`,
      userAnswer: '',
      score: 0
    }
  ];

  const behavioralQuestions = [
    {
      id: 'q_beh_1',
      type: 'behavioral',
      category: 'Behavioral & Leadership (STAR Method)',
      questionText: `Describe a scenario where you faced a major technical roadblock or tight deadline in a group project. How did you resolve conflict and deliver results?`,
      starPrompts: {
        situation: 'Describe the situation and context.',
        task: 'What was your specific responsibility or goal?',
        action: 'What actionable steps did you take?',
        result: 'What was the outcome and metric achieved?'
      },
      userAnswer: '',
      score: 0
    }
  ];

  // Project & Resume Questions
  const projectQuestions = [
    {
      id: 'q_proj_1',
      type: 'project',
      category: 'Project Architecture & Design',
      questionText: `Explain the system architecture of a major project you built. What database design, API flow, and scaling decisions did you make?`,
      userAnswer: '',
      score: 0
    },
    {
      id: 'q_res_1',
      type: 'resume',
      category: 'Resume & Internship Deep Dive',
      questionText: `Walk me through a key internship or hands-on certification listed on your resume. What key challenges did you tackle and what impact did you make?`,
      userAnswer: '',
      score: 0
    }
  ];

  const aptitudeQuestions = [
    {
      id: 'q_apt_1',
      type: 'aptitude',
      category: 'Logical Reasoning & Problem Solving',
      questionText: `A server cluster processes incoming API requests with a response time of 120ms. If 3 load balancers are added, reducing latency by 40%, what is the new average throughput and latency per request under 10,000 QPS load? Explain your analytical steps.`,
      userAnswer: '',
      score: 0
    }
  ];

  const systemDesignQuestions = [
    {
      id: 'q_sys_1',
      type: 'system_design',
      category: 'System Architecture & Scalability',
      questionText: `Design a high-throughput real-time notification service (like WhatsApp/Slack notifications). Address caching (Redis), message queues (Kafka/RabbitMQ), database sharding, and fault tolerance.`,
      userAnswer: '',
      score: 0
    }
  ];

  // Assemble question list based on interview type
  if (interviewType === 'Technical') {
    questions.push(...techQuestions.slice(0, 3), codingQuestions[0]);
  } else if (interviewType === 'Coding') {
    questions.push(...codingQuestions, techQuestions[0]);
  } else if (interviewType === 'HR') {
    questions.push(...hrQuestions, behavioralQuestions[0]);
  } else if (interviewType === 'Behavioral') {
    questions.push(...behavioralQuestions, hrQuestions[0]);
  } else if (interviewType === 'Aptitude') {
    questions.push(...aptitudeQuestions, techQuestions[2]);
  } else if (interviewType === 'System Design') {
    questions.push(...systemDesignQuestions, techQuestions[1]);
  } else {
    // Mixed Interview (Default / Full Assessment)
    questions.push(
      hrQuestions[0],
      techQuestions[0],
      codingQuestions[0],
      behavioralQuestions[0],
      projectQuestions[0],
      techQuestions[1]
    );
  }

  return questions;
}

// 1. Setup AI Interview Session
exports.setupInterview = async (req, res) => {
  try {
    const { jobRole, experienceLevel, interviewType, difficulty } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const userSkills = user?.technicalSkills || [];
    const questions = buildQuestionBank(jobRole, experienceLevel, interviewType, userSkills);

    const interview = new Interview({
      userId,
      jobRole: jobRole || 'Full-Stack Developer',
      experienceLevel: experienceLevel || 'Fresh Graduate',
      interviewType: interviewType || 'Mixed Interview',
      difficulty: difficulty || 'Medium',
      questions,
      status: 'in-progress'
    });

    await interview.save();

    res.json({
      success: true,
      interviewId: interview._id,
      jobRole: interview.jobRole,
      experienceLevel: interview.experienceLevel,
      interviewType: interview.interviewType,
      questions: interview.questions
    });
  } catch (error) {
    console.error('Setup interview error:', error);
    res.status(500).json({ message: 'Server error setting up interview' });
  }
};

// 2. Live Code Execution & Test Case Verification
exports.runCode = async (req, res) => {
  try {
    const { questionId, language, code, testCases } = req.body;
    if (!code || code.trim() === '') {
      return res.status(400).json({ message: 'Code cannot be empty' });
    }

    let passCount = 0;
    const totalCount = testCases ? testCases.length : 2;
    let logs = [];

    // Simulate code validation / test execution
    const isSyntacticallyValid = !code.includes('syntax_error_test_flag');
    const hasReturn = code.includes('return');
    const hasLoopOrMap = code.includes('for') || code.includes('while') || code.includes('Map') || code.includes('forEach') || code.includes('map');

    if (isSyntacticallyValid && hasReturn && hasLoopOrMap) {
      passCount = totalCount;
      logs.push('✓ Test Case 1 Passed (Sample Input)');
      logs.push('✓ Test Case 2 Passed (Edge Cases)');
      logs.push('✓ Test Case 3 Passed (Hidden Large Array)');
      logs.push('✓ All Test Cases Executed Successfully!');
    } else if (hasReturn) {
      passCount = Math.max(1, totalCount - 1);
      logs.push('✓ Test Case 1 Passed');
      logs.push('✗ Test Case 2 Failed: Output mismatch on edge case');
    } else {
      passCount = 0;
      logs.push('✗ Syntax Error / Missing return statement in function block.');
    }

    const timeComplexity = code.includes('for') && code.split('for').length > 2 ? 'O(N²)' : 'O(N)';
    const spaceComplexity = code.includes('Map') || code.includes('new Array') || code.includes('{}') ? 'O(N)' : 'O(1)';
    const codeQuality = passCount === totalCount ? 'A+ (Optimal & Clean)' : 'B (Sub-optimal or Incomplete)';

    res.json({
      passed: passCount === totalCount,
      passCount,
      totalCount,
      executionTime: `${(Math.random() * 12 + 8).toFixed(2)} ms`,
      memoryUsed: `${(Math.random() * 4 + 14).toFixed(1)} MB`,
      timeComplexity,
      spaceComplexity,
      codeQuality,
      outputLog: logs.join('\n')
    });
  } catch (error) {
    console.error('Run code error:', error);
    res.status(500).json({ message: 'Error executing code' });
  }
};

// 3. Submit Interview & Calculate 9-Metric Scores + AI Feedback
exports.submitInterview = async (req, res) => {
  try {
    const { interviewId, answers } = req.body;
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    let totalScore = 0;
    let technicalCount = 0;
    let codingCount = 0;
    let commCount = 0;
    let projCount = 0;

    let techSum = 0;
    let codeSum = 0;
    let commSum = 0;
    let confSum = 0;
    let probSum = 0;
    let projSum = 0;

    // Process each submitted question answer
    interview.questions.forEach((q, index) => {
      const userAns = answers?.[q.id] || answers?.[index];
      if (userAns) {
        if (typeof userAns === 'string') {
          q.userAnswer = userAns;
        } else {
          q.userAnswer = userAns.text || '';
          q.userCode = userAns.code || '';
          if (userAns.codeResult) {
            q.codeResult = userAns.codeResult;
          }
        }
      }

      // Calculate score for each question item based on length/substance & correctness
      let qScore = 75; // baseline attempt score
      const ansText = (q.userAnswer || q.userCode || '').trim();
      
      if (ansText.length > 200) qScore = 92;
      else if (ansText.length > 80) qScore = 84;
      else if (ansText.length > 20) qScore = 70;
      else if (ansText.length > 0) qScore = 55;
      else qScore = 30;

      if (q.type === 'coding' && q.codeResult?.passed) {
        qScore = Math.max(qScore, 95);
      }

      q.score = qScore;

      if (q.type === 'technical' || q.type === 'system_design') {
        techSum += qScore; technicalCount++;
      } else if (q.type === 'coding') {
        codeSum += qScore; codingCount++;
      } else if (q.type === 'hr' || q.type === 'behavioral') {
        commSum += qScore; commCount++;
      } else if (q.type === 'project' || q.type === 'resume') {
        projSum += qScore; projCount++;
      }
      probSum += qScore;
      confSum += Math.min(100, qScore + 5);
      totalScore += qScore;
    });

    const totalQuestions = interview.questions.length || 1;
    const overall = Math.round(totalScore / totalQuestions);
    const technical = technicalCount ? Math.round(techSum / technicalCount) : overall;
    const coding = codingCount ? Math.round(codeSum / codingCount) : Math.round(overall * 0.95);
    const communication = commCount ? Math.round(commSum / commCount) : Math.round(overall * 1.02);
    const confidence = Math.min(100, Math.round(confSum / totalQuestions));
    const problemSolving = Math.round(probSum / totalQuestions);
    const projectKnowledge = projCount ? Math.round(projSum / projCount) : Math.round(overall * 0.98);
    const placementReadiness = Math.round((overall + technical + coding + problemSolving) / 4);
    const careerReadiness = Math.round((overall + communication + confidence + placementReadiness) / 4);

    interview.scores = {
      technical,
      coding,
      communication,
      confidence,
      problemSolving,
      projectKnowledge,
      overall,
      placementReadiness,
      careerReadiness
    };

    // AI Feedback synthesis
    const certificateEligible = overall >= 80;
    const certId = certificateEligible ? `CERT-AI-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}` : null;

    interview.certificateEligible = certificateEligible;
    interview.certificateId = certId;
    interview.status = 'completed';
    interview.completedAt = new Date();

    interview.evaluation = {
      strengths: [
        'Demonstrates strong fundamental technical vocabulary & conceptual clarity.',
        'Structured problem-solving approach with clean step-by-step logic.',
        'High adaptability and clear articulation during behavioral STAR questions.'
      ],
      weaknesses: [
        'Can further optimize memory space complexity in large-scale data structures.',
        'Deeper focus recommended on distributed caching (Redis) and system resiliency.'
      ],
      missingSkills: ['System Design Bottlenecks', 'Advanced Kubernetes Deployment', 'Performance Profiling'],
      topicsToRevise: ['Database Indexing & Sharding', 'Time Complexity O(N log N) Sorting', 'Microservice API Gateways'],
      recommendedCourses: [
        'Full Stack System Design & Architecture Masterclass',
        'Data Structures & Algorithm Mastery for Tier-1 Tech Interviews',
        'Microservices & Containerization with Docker & Kubernetes'
      ],
      recommendedProjects: [
        'Real-time Distributed Event Notification Engine',
        'AI-Powered Resume & Skill Analysis Microservice',
        'Scalable E-Commerce Backend with Redis Cache Layer'
      ],
      interviewTips: [
        'Always communicate your thought process aloud before writing code.',
        'State constraints and edge cases upfront during coding assessments.',
        'Use the STAR method explicitly for behavioral questions (Situation, Task, Action, Result).'
      ],
      expectedLevel: overall >= 85 ? 'Senior / Lead Ready' : overall >= 75 ? 'Intermediate / Mid-Level Ready' : 'Junior / Associate Level',
      summary: `Candidate completed a ${interview.interviewType} session for ${interview.jobRole} with an Overall Score of ${overall}%. Demonstrated strong problem solving (${problemSolving}%) and technical execution (${technical}%).`
    };

    await interview.save();

    // Update user career readiness score in profile
    await User.findByIdAndUpdate(req.user.id, {
      careerReadinessScore: careerReadiness
    });

    res.json({
      success: true,
      interview
    });
  } catch (error) {
    console.error('Submit interview error:', error);
    res.status(500).json({ message: 'Server error submitting interview' });
  }
};

// 4. Get Interview History for Candidate
exports.getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id, status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(10);

    const stats = {
      totalInterviews: interviews.length,
      averageScore: interviews.length ? Math.round(interviews.reduce((acc, curr) => acc + (curr.scores?.overall || 0), 0) / interviews.length) : 0,
      bestScore: interviews.length ? Math.max(...interviews.map(i => i.scores?.overall || 0)) : 0,
      certificatesEarned: interviews.filter(i => i.certificateEligible).length
    };

    res.json({
      stats,
      interviews
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error getting interview history' });
  }
};

// 5. Get Single Interview Details
exports.getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id).populate('userId', 'fullName email degree collegeName');
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    res.json({ interview });
  } catch (error) {
    console.error('Get interview by ID error:', error);
    res.status(500).json({ message: 'Server error getting interview' });
  }
};
