export const PERSONAL_INFO = {
  name: "<Gunavarman P />",
  shortName: "Varma",
  title: "< AI Engineer | Full Stack Developer | Agentic AI Developer />",
  bio: "Aspiring AI Engineer and Full Stack Developer specializing in Agentic AI, Gen AI, LLMs, RAG, LangChain, and LangGraph. I build production-ready AI systems, intelligent assistants, and full-stack web experiences with React, Next.js, FastAPI, SQL, and MongoDB.",
  location: "Tamil Nadu, India",
  phone: "+91 93616 99358",
  email: "varma2905.tnp@gmail.com",
  github: "https://github.com/Varma2905",
  linkedin: "https://www.linkedin.com/in/gunavarman/",
  leetcode: "https://leetcode.com/u/GUNAVARMAN/",
  instagram: "https://www.instagram.com/_vxrma_05/",
  stats: {
    yearsExp: 2,
    projectsCompleted: 15,
    aiAgentsDeployed: 45,
    githubContributions: 1250,
  }
};

export const HERO_ROLES = [
  "<AI Engineer />",
  "<Full Stack Developer />",
  "<Agentic AI Specialist />",
  "<Gen AI & RAG Architect />",
  "<LangGraph & LangChain Developer />"
];

export const SKILLS = [
  // User's Core Highlights
  { name: "Agentic AI", category: "AI", level: 96, icon: "Workflow", color: "#e62429" },
  { name: "Gen AI", category: "AI", level: 95, icon: "Sparkles", color: "#2b6cff" },
  { name: "LLM", category: "AI", level: 94, icon: "Cpu", color: "#3b82f6" },
  { name: "RAG", category: "AI", level: 95, icon: "Database", color: "#ff3b3f" },
  { name: "LangChain", category: "AI", level: 92, icon: "Workflow", color: "#00ff88" },
  { name: "LangGraph", category: "AI", level: 94, icon: "Workflow", color: "#39ff14" },

  // Programming Languages
  { name: "Python", category: "Backend", level: 95, icon: "Code", color: "#3776ab" },
  { name: "Java", category: "Backend", level: 88, icon: "Code", color: "#f89820" },
  { name: "C++", category: "Backend", level: 85, icon: "Code", color: "#00599c" },
  { name: "C", category: "Backend", level: 82, icon: "Code", color: "#a8b9cc" },
  { name: "JavaScript", category: "Frontend", level: 92, icon: "FileCode", color: "#f7df1e" },
  { name: "TypeScript", category: "Frontend", level: 90, icon: "FileCode", color: "#3178c6" },

  // Frontend & 3D Web
  { name: "React.js", category: "Frontend", level: 95, icon: "Layout", color: "#61dafb" },
  { name: "Next.js", category: "Frontend", level: 92, icon: "Layout", color: "#ffffff" },
  { name: "Three.js", category: "Frontend", level: 88, icon: "Box", color: "#ffffff" },
  { name: "HTML & CSS", category: "Frontend", level: 98, icon: "Layout", color: "#e34f26" },

  // Backend & Databases
  { name: "Node.js", category: "Backend", level: 90, icon: "Server", color: "#339933" },
  { name: "Express.js", category: "Backend", level: 88, icon: "Server", color: "#ffffff" },
  { name: "FastAPI", category: "Backend", level: 92, icon: "Zap", color: "#059669" },
  { name: "MongoDB", category: "Database", level: 88, icon: "Database", color: "#47a248" },
  { name: "MySQL", category: "Database", level: 90, icon: "Database", color: "#4169e1" },

  // Cloud & DevOps
  { name: "Git & GitHub", category: "DevOps", level: 92, icon: "GitBranch", color: "#f05032" },
  { name: "AWS Cloud", category: "Cloud", level: 85, icon: "Cloud", color: "#ff9900" },
  { name: "Docker", category: "DevOps", level: 84, icon: "Box", color: "#2496ed" },
  { name: "Postman", category: "DevOps", level: 90, icon: "Terminal", color: "#ff6c37" },
  { name: "Vercel / Netlify / Render", category: "Cloud", level: 94, icon: "Cloud", color: "#000000" },

  // AI Tools & MLOps — models, frameworks, deployment
  { name: "Hugging Face", category: "AI Tools", level: 92, icon: "Sparkles", color: "#ffd21e" },
  { name: "PyTorch", category: "AI Tools", level: 90, icon: "Cpu", color: "#ee4c2c" },
  { name: "TensorFlow", category: "AI Tools", level: 88, icon: "Cpu", color: "#ff6f00" },
  { name: "Scikit-learn", category: "AI Tools", level: 94, icon: "Workflow", color: "#f7931e" },
  { name: "MLflow", category: "AI Tools", level: 86, icon: "GitBranch", color: "#0194e2" },
  { name: "OpenAI API", category: "AI Tools", level: 90, icon: "Sparkles", color: "#412991" }
];

export const PROJECTS = [
  {
    id: "dragmind-ai",
    title: "DragMind AI — Drug Discovery Platform",
    category: "Agentic AI",
    secondaryCategories: ["AI & ML", "Full Stack"],
    tagline: "AI-Powered Drug Discovery Platform using RAG, ML, and Molecular Cheminformatics.",
    description: "State-of-the-art AI Drug Discovery Platform integrating Retrieval-Augmented Generation (RAG) for scientific literature retrieval, SMILES molecular feature extraction, deep learning prediction models, and interactive 2D/3D cheminformatics visualization.",
    image: "/dragmind_ai.png",
    techStack: ["Python", "FastAPI", "React", "TypeScript", "RAG", "Vector DB", "Cheminformatics", "3D Visualization"],
    features: [
      "Molecular data input & SMILES chemical structure processing",
      "Interactive 2D and 3D molecular graph visualization",
      "Deep learning property prediction & toxicity analysis",
      "RAG-powered scientific paper & PubMed knowledge retrieval",
      "Prediction history, model benchmark & analytics dashboard"
    ],
    github: "https://github.com/Varma2905",
    liveDemo: "https://github.com/Varma2905",
    caseStudyUrl: "/projects/dragmind-ai",
    featured: true
  },
  {
    id: "neuro-os",
    title: "Neuro OS — Autonomous AI Workstation",
    category: "Agentic AI",
    secondaryCategories: ["Full Stack"],
    tagline: "Cross-platform Agentic AI desktop assistant (JARVIS platform) for autonomous task execution.",
    description: "Cross-platform Agentic AI assistant designed to plan and execute computer tasks using specialized AI agents for coding, browser interaction, vision, memory, and automation. Built with Python, LangGraph, FastAPI, Electron, and React for a seamless desktop experience.",
    image: "/neuro_os.png",
    techStack: ["Python", "LangGraph", "LLMs", "FastAPI", "Electron", "React", "TypeScript"],
    features: [
      "Specialized AI agents (coding, browser, vision, memory)",
      "Multi-step workflow planning & execution graph",
      "Cross-platform desktop & web interface",
      "Real-time task automation & vector memory management"
    ],
    github: "https://github.com/Varma2905",
    liveDemo: "https://github.com/Varma2905",
    caseStudyUrl: "/projects/neuro-os",
    featured: true
  },
  {
    id: "ml-forge-studio",
    title: "ML Forge Studio",
    category: "AI & ML",
    secondaryCategories: ["Full Stack"],
    tagline: "End-to-end ML platform for Regression & Classification with automated model training and reporting.",
    description: "End-to-end ML platform for dataset upload, preprocessing, model training, evaluation, prediction, model comparison, and automated reporting for Regression and Classification tasks. Built with React, FastAPI, TypeScript, Scikit-learn, and Hugging Face integration.",
    image: "/mlforge_ai.png",
    techStack: ["React", "TypeScript", "FastAPI", "Python", "Scikit-Learn", "Hugging Face"],
    features: [
      "Automated data preprocessing & feature engineering",
      "Multi-algorithm model training (Regression & Classification)",
      "Interactive model comparison & evaluation metrics",
      "Automated PDF report generation"
    ],
    github: "https://github.com/Varma2905",
    liveDemo: "https://github.com/Varma2905",
    caseStudyUrl: "/projects/ml-forge-studio",
    featured: true
  },
  {
    id: "electricity-demand-forecasting",
    title: "Agentic AI Electricity Demand Forecasting",
    category: "AI & ML",
    secondaryCategories: ["Agentic AI"],
    tagline: "Deep learning system forecasting electricity demand with explainability and multi-agent analysis.",
    description: "Agentic AI system to forecast next 10-minute electricity demand using CNN-LSTM-Attention architecture, SHAP explainability, and LangGraph-based multi-agent analysis. Combines deep learning predictions with intelligent agent-driven insights for optimal energy management.",
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1200&q=80",
    techStack: ["Python", "TensorFlow", "LSTM", "SHAP", "LangGraph", "Pandas", "Gemini API"],
    features: [
      "CNN-LSTM-Attention hybrid deep learning architecture",
      "SHAP-based model explainability & feature importance",
      "LangGraph multi-agent analysis framework",
      "Real-time 10-minute demand forecasting"
    ],
    github: "https://github.com/Varma2905",
    liveDemo: "https://github.com/Varma2905",
    caseStudyUrl: "/projects/electricity-demand-forecasting",
    featured: true
  },
  {
    id: "emotion-detection-system",
    title: "Facial Emotion Detection System",
    category: "Computer Vision",
    secondaryCategories: ["AI & ML"],
    tagline: "Deep learning facial expression classifier detecting multi-state human emotions in real time.",
    description: "Developed a deep learning-based computer vision system to analyze facial expressions and real-time camera feeds to classify human emotions such as happiness, sadness, anger, fear, surprise, and neutrality.",
    image: "/emotion_detection.png",
    techStack: ["Python", "PyTorch", "OpenCV", "Deep Learning", "Computer Vision", "FastAPI"],
    features: [
      "Real-time video frame expression extraction",
      "Multi-class facial feature classifier",
      "Sub-50ms inference stream latency",
      "Live emotion telemetry graphs"
    ],
    github: "https://github.com/Varma2905",
    liveDemo: "https://github.com/Varma2905",
    caseStudyUrl: "/projects/emotion-detection-system",
    featured: true
  },
  {
    id: "expense-tracker",
    title: "Smart Expense Tracker",
    category: "Full Stack",
    secondaryCategories: [],
    tagline: "Full-stack expense management with secure authentication and visual analytics.",
    description: "Full-stack expense management application for recording, categorizing, tracking, and visualizing expenses with secure user authentication. Built with React, TypeScript, Node.js, Express.js, and MongoDB.",
    image: "/expence_tracker.png",
    techStack: ["React", "TypeScript", "Node.js", "Express.js", "MongoDB"],
    features: [
      "Secure user authentication & authorization",
      "Smart expense categorization",
      "Visual spending analytics & charts",
      "Real-time expense tracking dashboard"
    ],
    github: "https://github.com/Varma2905/smart-expense",
    liveDemo: "https://smart-expense-lime.vercel.app/",
    caseStudyUrl: "/projects/expense-tracker",
    featured: true
  }
];

export const EXPERIENCES = [
  {
    period: "2023 — 2027",
    role: "B.Tech AI & Data Science Candidate",
    company: "Kongu Engineering College",
    location: "Tamil Nadu, India",
    description: "Specializing in Artificial Intelligence, Data Science, Machine Learning pipelines, Full Stack Web Development, Agentic AI, and Cloud Infrastructure.",
    skills: ["Agentic AI", "Gen AI", "Python", "React.js", "FastAPI", "LangChain"]
  }
];

export const EDUCATION = [
  {
    degree: "B.Tech in Artificial Intelligence & Data Science",
    institution: "Kongu Engineering College",
    period: "2023 — 2027",
    honors: "Pursuing",
    description: "Focusing on AI/ML Algorithms, Deep Learning, Full Stack Engineering, Agentic AI Systems, and Cloud Computing."
  },
  {
    degree: "12th Grade (Higher Secondary)",
    institution: "Kamban Kalvi Nilaiyam, Gobichettipalayam",
    period: "2023",
    honors: "Completed",
    description: "Core Physics, Chemistry, Mathematics, and Computer Science."
  }
];

export const SERVICES = [
  {
    id: "agentic-ai",
    title: "Agentic AI & LangGraph Swarms",
    description: "Building multi-agent autonomous swarms with LangGraph, LangChain, and RAG vector databases to automate complex data and workflow tasks.",
    icon: "Workflow",
    gradient: "from-red-500 to-blue-600"
  },
  {
    id: "gen-ai-llm",
    title: "Gen AI & RAG System Design",
    description: "Architecting custom Retrieval-Augmented Generation (RAG) engines, prompt pipelines, and specialized fine-tuned LLM applications.",
    icon: "Brain",
    gradient: "from-purple-500 to-indigo-600"
  },
  {
    id: "web-development",
    title: "Full Stack & 3D Web Apps",
    description: "Building high-performance React.js, Next.js, Node.js, and Three.js 3D web applications with futuristic luxury UI aesthetics.",
    icon: "Layout",
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    id: "api-development",
    title: "FastAPI & Express Engineering",
    description: "High-speed Python FastAPI and Node.js microservices with MySQL and MongoDB databases for real-time model inference.",
    icon: "Zap",
    gradient: "from-amber-500 to-orange-600"
  },
  {
    id: "mlops-cloud",
    title: "MLOps & Cloud Deployment",
    description: "Containerizing machine learning models with Docker and deploying onto AWS Cloud, Vercel, Netlify, and Render.",
    icon: "Cpu",
    gradient: "from-pink-500 to-rose-600"
  }
];

export const TESTIMONIALS = [
  {
    quote: "Gunavarman delivered an exceptional Agentic AI Regression platform. His mastery over React, FastAPI, and LLM agentic workflows is truly top-tier.",
    author: "Kongu AI Lab Reviewer",
    role: "Project Advisor",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    quote: "Gunavarman's 3D spatial web design and deep learning skills make him stand out as an elite full-stack AI engineer.",
    author: "Technical Peer",
    role: "Full Stack Lead",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  }
];

export const CERTIFICATES = [
  {
    title: "Generative AI with Diffusion Models",
    issuer: "NVIDIA",
    date: "2024",
    credentialId: "NVIDIA-GENAI-2024",
    file: "/certification/nvidia.png",

  },
  {
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services (AWS)",
    date: "2024",
    credentialId: "AWS-CP-2024",
    file: "/certification/cloud-computing.png",

  },
  {
    title: "Java Foundations & Programming",
    issuer: "Oracle / Tech Academy",
    date: "2023",
    credentialId: "JAVA-FOUND-01",
    file: "/certification/java-foundation.png",

  },
  {
    title: "C & C++ Programming Specialist",
    issuer: "Programming Academy",
    date: "2023",
    credentialId: "CPP-PROG-2023",
    file: "/certification/c_and_cpp.jpg",

  }
];

export const BLOG_POSTS = [
  {
    slug: "building-agentic-ai-regression-studio-langgraph",
    title: "Building an AI Regression Studio using Agentic AI & LangGraph",
    excerpt: "A deep dive into integrating FastAPI, React, Scikit-learn, and LLM-based agentic workflows to automate data preprocessing and prediction.",
    date: "2026-07-20",
    readTime: "7 min read",
    category: "Agentic AI",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
  },
  {
    slug: "realtime-facial-emotion-detection-deep-learning",
    title: "Real-Time Facial Emotion Detection with PyTorch & OpenCV",
    excerpt: "Architecting a multi-state deep learning vision pipeline for sub-50ms facial expression recognition.",
    date: "2026-06-14",
    readTime: "5 min read",
    category: "AI & ML",
    image: "/emotion_detection.png"
  }
];
