import { useState, useEffect, useRef } from "react";
import {
    Play,
    CheckCircle,
    HelpCircle,
    Trophy,
    FileUp,
    Download,
    ChevronRight,
    Search,
    Compass,
    ExternalLink,
    Loader2,
    Sparkles,
    X,
    ArrowLeft,
    Clock,
    Video,
    GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";
import "./learning.css";
import CoursesSection from "./CoursesSection";
const DEFAULT_ROADMAP_PHASES = [
    { step: 1, title: "Web Foundations", desc: "HTML5 semantic tags, CSS layouts (Flexbox & Grid), responsive design.", topics: ["HTML5 semantics", "CSS layout rules", "Media queries", "CSS Flexbox", "CSS Grid", "Animations"], details: "Focus on building a responsive personal profile website. Practice layout design using CSS Flexbox and Grid, ensuring the site functions well on both mobile and desktop screens." },
    { step: 2, title: "JavaScript Core", desc: "DOM manipulation, asynchronous fetching, fetch APIs, arrays callbacks.", topics: ["DOM manipulations", "Array methods (map, filter)", "ES6 modules", "Fetch APIs", "Error handling", "Storage (localStorage)"], details: "Build an interactive todo app or a weather dashboard. Practice writing asynchronous functions with fetch APIs and storing local user data in localStorage." },
    { step: 3, title: "React Framework", desc: "React interactive components, state, hooks (useState, useEffect).", topics: ["Components props", "State management", "React custom hooks", "React router paths", "Context API", "Forms validations"], details: "Create a multi-page dashboard app. Focus on component reactivity, managing parent-child component communication, state lifting, and clean form validation rules." },
    { step: 4, title: "Testing & Deployment", desc: "Vite, Git source branching, deploying static sites (Netlify, Vercel).", topics: ["Git workflows", "Vite builds", "Netlify/Vercel hostings", "Lighthouse testing", "Portfolio creations", "Continuous integration"], details: "Deploy your final React app to Vercel or Netlify. Set up GitHub Actions for continuous integration, run Lighthouse to analyze and improve web performance." }
];

const PRESET_ROADMAPS = {
    "python": {
        title: "Python Developer Roadmap",
        phases: [
            { step: 1, title: "Python Basics", desc: "Understand variables, data types, loops, conditionals, and functions.", topics: ["Variables & Expressions", "If-Else & Loops", "Lists, Tuples, Dicts", "Functions & Scope", "File I/O basics"], details: "Begin by writing simple scripts. Focus on learning flow control (if/else, loops) and data structures (lists, dictionaries). Try building a simple CLI calculator." },
            { step: 2, title: "OOP & Advanced Python", desc: "Master Object-Oriented Programming, exception handling, and modules.", topics: ["Classes & Inheritance", "Exceptions handling", "Imports & Modules", "Decorators & Generators", "List Comprehensions"], details: "Learn the core concepts of Object-Oriented Programming (OOP) including inheritance, encapsulation, and polymorphism. Practice writing reusable and modular code." },
            { step: 3, title: "Libraries & Databases", desc: "Learn packages, virtual environments, and database integration.", topics: ["pip & virtual environments", "SQLite & PostgreSQL", "SQLAlchemy ORM", "Requests library", "Unit testing (unittest/pytest)"], details: "Connect Python to databases using sqlite3 and PostgreSQL. Use ORMs like SQLAlchemy to map database tables to Python classes. Practice writing unit tests." },
            { step: 4, title: "Web Frameworks & APIs", desc: "Build REST APIs and web servers using modern Python web frameworks.", topics: ["FastAPI foundations", "Flask web app building", "RESTful API design", "Asynchronous Python (asyncio)", "Deployment to Render/Heroku"], details: "Choose either FastAPI or Flask to build web APIs. Learn about HTTP requests, routing, query parameters, and serializing data to JSON formats." }
        ]
    },
    "react": {
        title: "React Developer Roadmap",
        phases: [
            { step: 1, title: "React Foundations", desc: "Understand JSX, functional components, props, and rendering patterns.", topics: ["JSX Syntax rules", "Functional Components", "Props passing", "Lists & Keys", "Conditional rendering"], details: "Learn the declarative nature of React. Focus on how props flow from parent to child components and how JSX gets converted to virtual DOM nodes." },
            { step: 2, title: "State & Hooks", desc: "Master reactive state management and common React lifecycle hooks.", topics: ["useState state variables", "useEffect side effects", "Handling Forms & Inputs", "Custom React hooks", "Component Lifecycle"], details: "Understand how React components re-render when state changes. Master the dependency array in useEffect to fetch data and clean up events." },
            { step: 3, title: "Routing & Architecture", desc: "Learn client-side routing, code organization, and folder structure.", topics: ["React Router Dom", "Dynamic path segments", "Layout & Outlet components", "Context API sharing", "Folder organization rules"], details: "Implement multi-page feeling apps with React Router. Learn to share global user session states across distant components using the Context API." },
            { step: 4, title: "State Management & Performance", desc: "Scale React applications with advanced state containers and optimization.", topics: ["Zustand / Redux Toolkit", "React Query data fetching", "useMemo & useCallback", "React.lazy & Suspense", "Profiling performance"], details: "Integrate state management libraries like Zustand. Implement optimization techniques like code-splitting using lazy loading and memoization." }
        ]
    },
    "data science": {
        title: "Data Science Roadmap",
        phases: [
            { step: 1, title: "Math & Programming Basics", desc: "Build foundations in Python programming, linear algebra, and statistics.", topics: ["Python for Data Science", "Linear Algebra matrices", "Probability theory", "Descriptive statistics", "Jupyter Notebooks"], details: "Learn the core mathematical principles (mean, variance, probability distributions) and write clean Python code using Jupyter Notebooks." },
            { step: 2, title: "Data Manipulation", desc: "Wrangle, clean, and pre-process datasets using pandas and numpy.", topics: ["Pandas DataFrames", "NumPy array operations", "Handling missing values", "Data merging & filtering", "Feature engineering basics"], details: "Work with real-world messy datasets. Clean duplicate data, fill missing cells, convert data formats, and create new descriptive columns." },
            { step: 3, title: "Exploratory Data Analysis", desc: "Visualize patterns and distributions in datasets using visualization tools.", topics: ["Matplotlib plotting", "Seaborn styling", "Exploratory data analysis (EDA)", "Outlier detections", "Correlation analysis"], details: "Create plots, charts, and heatmaps to discover relationships between features. Document your insights and tell stories with data." },
            { step: 4, title: "Machine Learning Foundations", desc: "Train and evaluate classic machine learning models using Scikit-Learn.", topics: ["Linear & Logistic Regression", "Decision Trees & Forests", "Model training & splitting", "Evaluation metrics (F1, MSE)", "Overfitting & regularization"], details: "Train regression models to predict numbers, and classification models to predict labels. Use cross-validation to assess performance." }
        ]
    },
    "cyber security": {
        title: "Cybersecurity Pathway Roadmap",
        phases: [
            { step: 1, title: "Networking & OS Basics", desc: "Understand computer networks, routing protocols, and operating systems.", topics: ["TCP/IP & OSI model", "DNS, HTTP, & TLS", "Linux commands & bash", "Windows Server admin", "Network sniffing (Wireshark)"], details: "Learn how packets travel through the internet. Master the Linux CLI and practice analyzing network logs with Wireshark." },
            { step: 2, title: "Security Fundamentals", desc: "Learn key security principles, cryptography, and access control models.", topics: ["Symmetric & Asymmetric encryption", "Hashing & Digital Signatures", "IAM & Access controls", "Firewalls & VPNs", "Common attack vectors"], details: "Study symmetric and asymmetric encryption. Implement secure access guidelines and understand how firewalls inspect traffic." },
            { step: 3, title: "Offensive Security", desc: "Understand ethical hacking, penetration testing, and vulnerability assessment.", topics: ["OWASP Top 10 vulnerabilities", "Penetration testing phases", "Nmap network scanning", "Metasploit framework", "SQL injection & XSS testing"], details: "Learn to identify system vulnerabilities. Build safe labs to practice SQL Injection, Cross-Site Scripting (XSS), and basic exploits." },
            { step: 4, title: "Defensive Security & Operations", desc: "Learn how to monitor, detect, and respond to cyber attacks.", topics: ["SIEM tools (Splunk)", "Log analysis & alerts", "Incident Response phases", "Security auditing basics", "Disaster recovery planning"], details: "Understand security monitoring. Learn how to write security alerts and respond to breaches in an network environment." }
        ]
    },
    "devops": {
        title: "DevOps & Cloud Roadmap",
        phases: [
            { step: 1, title: "Linux & Git", desc: "Learn terminal navigation, shell scripting, and version control workflows.", topics: ["Linux administration", "Bash shell scripting", "Git branching strategies", "GitHub pull requests", "SSH keys & access"], details: "Build a strong command-line foundation. Automate tasks using bash scripts and master advanced Git commits and rebase patterns." },
            { step: 2, title: "Containers & Orchestration", desc: "Package applications into container images and manage deployments at scale.", topics: ["Docker containers & images", "Dockerfile writing rules", "Docker Compose stacks", "Kubernetes pods & services", "K8s deployments & configs"], details: "Containerize static and dynamic websites. Create Dockerfiles, link services via Compose, and learn Kubernetes deployment configurations." },
            { step: 3, title: "CI/CD & IaC", desc: "Automate build and deployment pipelines, and configure cloud servers programmatically.", topics: ["GitHub Actions pipelines", "Jenkins CI jobs", "Terraform provisionings", "Ansible playbooks", "Secrets management"], details: "Build automated pipelines that trigger on push. Use Terraform to spin up servers, and configure them automatically." },
            { step: 4, title: "Monitoring & Cloud Providers", desc: "Deploy pipelines on cloud infrastructures and monitor metrics & logs.", topics: ["AWS services (EC2, S3)", "Prometheus metrics collection", "Grafana dashboards", "ELK stack log analysis", "Site Reliability Engineering (SRE)"], details: "Host apps in the cloud. Collect system resource logs and visualize application performance using Prometheus and Grafana dashboards." }
        ]
    },
    "ui/ux": {
        title: "UI/UX Designer Roadmap",
        phases: [
            { step: 1, title: "UX Research & Wireframes", desc: "Understand user needs, research methodologies, and outline page structures.", topics: ["User interviews & personas", "User journey mapping", "Information architecture", "Low-fidelity wireframes", "Sketching ideas"], details: "Start with the user's perspective. Create descriptive personas and structure user flows before touching colors or typography." },
            { step: 2, title: "UI Design Principles", desc: "Master the visual guidelines of clean, premium user interface designs.", topics: ["Typography hierarchies", "Color theory & HSL", "Grids & spacing rules", "Visual hierarchy techniques", "Design guidelines (Material/iOS)"], details: "Learn to pair fonts and use grid systems. Master light and dark modes, ensuring consistent spacing and accessible contrast ratios." },
            { step: 3, title: "Figma Prototyping", desc: "Build high-fidelity vector designs and interactive app prototypes in Figma.", topics: ["Figma auto-layout rules", "Components & variants", "Interactive prototyping", "Transitions & micro-animations", "Design system setups"], details: "Leverage Figma's auto-layout for responsive UI blocks. Set up robust component libraries with variants and design system tokens." },
            { step: 4, title: "Usability Testing & Handoff", desc: "Test prototypes with real users, gather feedback, and deliver designs to developers.", topics: ["Heuristic evaluations", "A/B testing methods", "Figma developer mode", "CSS exporting instructions", "Asset exports"], details: "Conduct user testing to validate layout choices. Export designs cleanly to development teams with explicit CSS metrics and code links." }
        ]
    },
    "machine learning": {
        title: "Machine Learning Roadmap",
        phases: [
            { step: 1, title: "ML Fundamentals", desc: "Learn basic mathematics, python libraries, and dataset handling.", topics: ["Python & Jupyter basics", "Linear Algebra & Calculus", "Probability & Statistics", "Data cleaning & scaling", "Scikit-Learn library"], details: "Understand how matrices represent data. Practice normalizing, scaling, and preparing feature vectors for training models." },
            { step: 2, title: "Supervised & Unsupervised Learning", desc: "Master classic ML algorithms for classification, regression, and clustering.", topics: ["Linear & Logistic Regression", "Decision Trees & Random Forests", "Support Vector Machines (SVM)", "K-Means & DBSCAN clustering", "Principal Component Analysis (PCA)"], details: "Train classification models to label items, regression models to project curves, and clustering models to group features without labels." },
            { step: 3, title: "Deep Learning & Neural Networks", desc: "Build and compile artificial neural networks using PyTorch or TensorFlow.", topics: ["Neural Network layers", "Activation functions (ReLU, Sigmoid)", "Backpropagation & GD", "PyTorch / TensorFlow syntax", "Loss functions"], details: "Learn the math behind weights and biases. Code neural network architectures, configure optimizers, and run forward/backward passes." },
            { step: 4, title: "Advanced ML & Deployment", desc: "Learn advanced vision/NLP models and how to serve predictions via APIs.", topics: ["Convolutional Networks (CNN)", "Transformer architectures", "Model serialization (joblib/ONNX)", "API deployment (FastAPI/Docker)", "Model monitoring concepts"], details: "Expose your model parameters as interactive REST APIs. Bundle models inside Docker containers to serve predictions reliably." }
        ]
    },
    "java": {
        title: "Java Developer Roadmap",
        phases: [
            { step: 1, title: "Java Core Syntax", desc: "Understand variables, conditionals, arrays, methods, and compile workflows.", topics: ["Java JDK & JVM setups", "Data types & variables", "Control structures (loops/if)", "Arrays & ArrayLists", "Method parameters"], details: "Set up the Java Development Kit. Learn to compile and run Java programs from the terminal, focusing on basic algorithmic structures." },
            { step: 2, title: "OOP & Collections", desc: "Master interfaces, abstract classes, collections, and generic structures.", topics: ["Classes, Objects, Inheritance", "Polymorphism & Interfaces", "Java Collections (List, Set, Map)", "Generics foundations", "Exception handling (try-catch)"], details: "Write scalable Object-Oriented code. Use Java standard collections (like HashMaps and ArrayLists) to manage groups of objects." },
            { step: 3, title: "Streams & Concurrency", desc: "Learn modern Java functional features and handling multi-threaded tasks.", topics: ["Java Streams API", "Lambda expressions", "Concurrency & Thread pools", "File I/O and NIO2", "JVM memory models"], details: "Use the functional Streams API to clean up loops. Learn thread synchronization, executors, and how the JVM allocates memory." },
            { step: 4, title: "Spring Boot APIs", desc: "Build enterprise REST APIs, connect databases, and configure security.", topics: ["Spring Boot foundations", "REST Controllers & routing", "Spring Data JPA & Hibernate", "Spring Security credentials", "Maven/Gradle dependencies"], details: "Develop production-ready backend servers. Integrate relational databases using JPA, write controllers, and secure API endpoints." }
        ]
    }
};

export default function Learning({ learningSubTab, setLearningSubTab, t = (k, fallback) => fallback || k, onAttemptAssessment }) {
    const [selectedRoadmapStep, setSelectedRoadmapStep] = useState(1);
    const [roadmapPhases, setRoadmapPhases] = useState(DEFAULT_ROADMAP_PHASES);
    const [roadmapTitle, setRoadmapTitle] = useState("Frontend Development Roadmap");
    const [roadmapOption, setRoadmapOption] = useState("Frontend Engineering");
    const [customRoadmapQuery, setCustomRoadmapQuery] = useState("");
    const [roadmapSearchQuery, setRoadmapSearchQuery] = useState("");
    const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
    const [roadmapError, setRoadmapError] = useState("");
    const [videoLectures, setVideoLectures] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [watchProgressPercent, setWatchProgressPercent] = useState(0);
    const [enrollingVideo, setEnrollingVideo] = useState(null);
    const [videoSearchQuery, setVideoSearchQuery] = useState("");

    const SEARCH_RELATION_GROUPS = [
        ["python", "django", "flask", "backend", "web development"],
        ["react", "mern", "javascript", "js", "node", "express", "mongodb", "frontend"],
        ["devops", "devop", "docker", "kubernetes", "aws", "cloud", "git", "ci/cd"],
        ["sql", "database", "db", "mysql", "postgresql"],
        ["java", "spring", "spring boot", "oop"],
    ];

    const getSearchTerms = (queryStr) => {
        const trimmed = queryStr.trim().toLowerCase();
        if (!trimmed) return [];
        
        const terms = new Set([trimmed]);
        
        SEARCH_RELATION_GROUPS.forEach(group => {
            const hasMatch = group.some(term => trimmed.includes(term) || term.includes(trimmed));
            if (hasMatch) {
                group.forEach(t => terms.add(t));
            }
        });
        
        return Array.from(terms);
    };

    const searchTerms = getSearchTerms(videoSearchQuery);

    const filteredVideoLectures = videoSearchQuery.trim() === ""
        ? videoLectures.slice(0, 6)
        : videoLectures.filter(video => {
            const titleLower = video.title.toLowerCase();
            const catLower = video.category ? video.category.toLowerCase() : "";
            
            return searchTerms.some(term => titleLower.includes(term) || catLower.includes(term));
          });

    const handleConfirmEnroll = async () => {
        if (!enrollingVideo) return;
        
        try {
            const response = await fetch("/api/courses/videos/progress/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    videoId: enrollingVideo.id,
                    lastPosition: 0.0,
                    percentage: 0
                })
            });
            const data = await response.json();
            if (data.success) {
                // Update local state: mark this video as enrolled in videoLectures
                setVideoLectures(prev => prev.map(v => 
                    v.id === enrollingVideo.id 
                        ? { ...v, is_enrolled: true, percentage: 0, last_position: 0.0 }
                        : v
                ));
                
                // Immediately open the player for this video
                const enrolledVid = { ...enrollingVideo, is_enrolled: true, percentage: 0, last_position: 0.0 };
                setSelectedVideo(enrolledVid);
                setWatchProgressPercent(0);
            } else {
                alert(data.message || "Failed to enroll in the course.");
            }
        } catch (err) {
            console.error("Error enrolling in course:", err);
            alert("Error enrolling in course. Please try again.");
        } finally {
            setEnrollingVideo(null);
        }
    };

    const videoRef = useRef(null);
    const lastSavedTimeRef = useRef(0);
    const ytPlayerRef = useRef(null);
    const ytIntervalRef = useRef(null);
    const watchedSecondsRef = useRef(new Set());

    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const parseDuration = (durationStr) => {
        if (!durationStr) return 0;
        const parts = durationStr.split(':').map(Number);
        if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
        } else if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
        const parsed = parseFloat(durationStr);
        return isNaN(parsed) ? 0 : parsed;
    };

    const initWatchedSeconds = (duration) => {
        watchedSecondsRef.current.clear();
        const savedPercent = selectedVideo.percentage || 0;
        const totalSec = duration || 1;
        const initialWatchedCount = Math.floor((savedPercent / 100) * totalSec);
        for (let i = 0; i < initialWatchedCount; i++) {
            watchedSecondsRef.current.add(i);
        }
        setWatchProgressPercent(savedPercent);
    };

    const recordActiveSecond = (currentTime, duration) => {
        if (!selectedVideo) return;
        const sec = Math.floor(currentTime);
        const totalSec = duration || 1;
        
        if (sec >= 0 && sec < totalSec) {
            watchedSecondsRef.current.add(sec);
        }
        
        const watchedCount = watchedSecondsRef.current.size;
        let percent = Math.min(Math.floor((watchedCount / totalSec) * 100), 100);
        
        // "When the video is remaining only 10% then if the user skip the video still count their progress to hundred percent."
        if (currentTime >= 0.9 * totalSec) {
            percent = 100;
        }

        if (percent !== watchProgressPercent) {
            setWatchProgressPercent(percent);
        }
    };

    // Fetch videos list from backend
    useEffect(() => {
        const loadVideos = async () => {
            try {
                const response = await fetch("/api/courses/videos/");
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setVideoLectures(data.videos);
                    }
                }
            } catch (err) {
                console.error("Error loading course videos:", err);
            }
        };
        loadVideos();
    }, []);

    // YouTube Iframe player lifecycle management
    useEffect(() => {
        if (!selectedVideo) return;
        const ytId = getYouTubeId(selectedVideo.video_url);
        if (!ytId) return;

        let checkInterval = null;

        const initYouTubePlayer = (videoId) => {
            if (ytPlayerRef.current) return;
            const placeholder = document.getElementById("yt-player-placeholder");
            if (!placeholder) return;

            try {
                ytPlayerRef.current = new window.YT.Player("yt-player-placeholder", {
                    height: "100%",
                    width: "100%",
                    videoId: videoId,
                    playerVars: {
                        start: Math.floor(selectedVideo.last_position || 0),
                        enablejsapi: 1,
                        modestbranding: 1,
                        rel: 0
                    },
                    events: {
                        onReady: (event) => {
                            const duration = event.target.getDuration() || 1;
                            initWatchedSeconds(duration);
                        },
                        onStateChange: (event) => {
                            if (event.data === 1) {
                                startYtProgressTracking();
                            } else {
                                stopYtProgressTracking();
                                saveYtProgress();
                            }
                        }
                    }
                });
            } catch (e) {
                console.error("Error initializing YT Player:", e);
            }
        };

        const checkAndInit = () => {
            if (window.YT && window.YT.Player) {
                initYouTubePlayer(ytId);
                if (checkInterval) {
                    clearInterval(checkInterval);
                    checkInterval = null;
                }
            }
        };

        // If API script is not already loaded
        if (!window.YT) {
            if (!document.getElementById("youtube-iframe-api")) {
                const tag = document.createElement("script");
                tag.id = "youtube-iframe-api";
                tag.src = "https://www.youtube.com/iframe_api";
                const firstScriptTag = document.getElementsByTagName("script")[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }
        }

        window.onYouTubeIframeAPIReady = () => {
            checkAndInit();
        };

        // Check immediately and start polling (safeguard against race conditions / cached scripts)
        checkAndInit();
        checkInterval = setInterval(checkAndInit, 200);

        return () => {
            if (checkInterval) {
                clearInterval(checkInterval);
                checkInterval = null;
            }
            stopYtProgressTracking();
            if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
                try {
                    ytPlayerRef.current.destroy();
                } catch(e){}
            }
            ytPlayerRef.current = null;
        };
    }, [selectedVideo]);

    const startYtProgressTracking = () => {
        if (ytIntervalRef.current) clearInterval(ytIntervalRef.current);
        ytIntervalRef.current = setInterval(() => {
            if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
                try {
                    const currentTime = ytPlayerRef.current.getCurrentTime();
                    const duration = ytPlayerRef.current.getDuration() || 1;
                    
                    recordActiveSecond(currentTime, duration);
                    
                    if (Math.abs(currentTime - lastSavedTimeRef.current) >= 5) {
                        saveVideoProgress(currentTime);
                    }
                } catch (e) {}
            }
        }, 1000);
    };

    const stopYtProgressTracking = () => {
        if (ytIntervalRef.current) {
            clearInterval(ytIntervalRef.current);
            ytIntervalRef.current = null;
        }
    };

    const saveYtProgress = () => {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
            try {
                const currentTime = ytPlayerRef.current.getCurrentTime();
                saveVideoProgress(currentTime);
            } catch (e) {}
        }
    };

    const handleVideoMetadataLoaded = () => {
        if (videoRef.current && selectedVideo) {
            const duration = videoRef.current.duration || 1;
            initWatchedSeconds(duration);
            videoRef.current.currentTime = selectedVideo.last_position || 0;
        }
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current || !selectedVideo) return;
        const video = videoRef.current;
        const currentTime = video.currentTime;
        const duration = video.duration || 1;
        
        recordActiveSecond(currentTime, duration);

        if (Math.abs(currentTime - lastSavedTimeRef.current) >= 5) {
            saveVideoProgress(currentTime);
        }
    };

    const saveVideoProgress = async (timeOverride, percentOverride) => {
        if (!selectedVideo) return;
        
        let time = timeOverride;
        let percent = percentOverride;

        if (time === undefined) {
            const ytId = getYouTubeId(selectedVideo.video_url);
            if (ytId) {
                if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
                    try {
                        time = ytPlayerRef.current.getCurrentTime();
                    } catch (e) {
                        return;
                    }
                } else {
                    return;
                }
            } else if (videoRef.current) {
                time = videoRef.current.currentTime;
            } else {
                return;
            }
        }

        if (percent === undefined) {
            let duration = 1;
            const ytId = getYouTubeId(selectedVideo.video_url);
            if (ytId) {
                if (ytPlayerRef.current && typeof ytPlayerRef.current.getDuration === 'function') {
                    duration = ytPlayerRef.current.getDuration() || 1;
                }
            } else if (videoRef.current) {
                duration = videoRef.current.duration || 1;
            } else {
                duration = parseDuration(selectedVideo.duration) || 1;
            }
            
            const watchedCount = watchedSecondsRef.current.size;
            percent = Math.min(Math.floor((watchedCount / duration) * 100), 100);
            
            if (time >= 0.9 * duration) {
                percent = 100;
            }
        }

        lastSavedTimeRef.current = time;

        try {
            const response = await fetch("/api/courses/videos/progress/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    videoId: selectedVideo.id,
                    lastPosition: time,
                    percentage: percent
                })
            });
            const data = await response.json();
            if (data.success) {
                setVideoLectures(prev => prev.map(v => 
                    v.id === selectedVideo.id 
                        ? { ...v, last_position: time, percentage: percent }
                        : v
                ));
            }
        } catch (err) {
            console.error("Error saving progress to backend:", err);
        }
    };

    const handleVideoEnded = () => {
        saveVideoProgress(undefined, 100);
    };

    const closeVideoPlayer = () => {
        const ytId = selectedVideo ? getYouTubeId(selectedVideo.video_url) : null;
        if (ytId) {
            saveYtProgress();
            stopYtProgressTracking();
        } else if (videoRef.current) {
            saveVideoProgress();
        }
        setSelectedVideo(null);
    };
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizScore, setQuizScore] = useState(null);

    const [uploadingAssignmentId, setUploadingAssignmentId] = useState(null);
    const [uploadedFile, setUploadedFile] = useState({});
    const [assignments, setAssignments] = useState([
        { id: 1, title: "Responsive Layout Page", deadline: "22 June 2026", status: "Pending", grade: null },
        { id: 2, title: "React Counter with hooks", deadline: "15 June 2026", status: "Graded", grade: "9.8/10" },
        { id: 3, title: "JavaScript ES6 Exercises", deadline: "10 June 2026", status: "Submitted", grade: null }
    ]);

    // AI explore courses states
    const [exploreQuery, setExploreQuery] = useState("");
    const [exploreCourses, setExploreCourses] = useState([
        { title: "React - The Complete Guide", platform: "Udemy", category: "Web Development", level: "Beginner", description: "Dive in and learn React.js from scratch. Learn Hooks, Redux, React Routing, Animations, and next-gen JS features.", link: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/" },
        { title: "Machine Learning by Andrew Ng", platform: "Coursera", category: "Data Science", level: "Beginner", description: "A broad introduction to machine learning, datamining, and statistical pattern recognition. Real-world case studies.", link: "https://www.coursera.org/learn/machine-learning" },
        { title: "CS50: Introduction to Computer Science", platform: "edX", category: "Computer Science", level: "Beginner", description: "Harvard University's introduction to the intellectual enterprises of computer science and the art of programming.", link: "https://www.edx.org/course/introduction-computer-science-harvardx-cs50x" }
    ]);
    const [isExploring, setIsExploring] = useState(false);
    const [exploreError, setExploreError] = useState("");

    const fetchAICourses = async (e) => {
        if (e) e.preventDefault();
        if (!exploreQuery.trim()) return;

        setIsExploring(true);
        setExploreError("");

        const prompt = `Return a list of 6 actual, highly rated online courses matching the topic: "${exploreQuery}".
For each course, output a JSON object with keys:
- "title": Name of the course
- "platform": Name of the platform (e.g. Coursera, Udemy, edX, Pluralsight, Udacity)
- "category": Short subject name (e.g., Web Development, Machine Learning, Design, Business)
- "level": One of "Beginner", "Intermediate", "Advanced"
- "description": A short 2-sentence description of the course content.
- "link": A realistic URL link to the course on the platform.

Format the output strictly as a JSON array. Do not wrap the JSON in markdown code blocks like \`\`\`json. Return only the JSON string.`;

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY || ''}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "ShikshaSetu"
                },
                body: JSON.stringify({
                    model: "cohere/north-mini-code:free",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`);
            }

            const data = await response.json();
            let text = data.choices[0].message.content.trim();
            
            // Clean up any markdown code blocks returned by the model
            if (text.startsWith("```")) {
                text = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
            }

            const parsed = JSON.parse(text);
            if (Array.isArray(parsed)) {
                setExploreCourses(parsed);
            } else {
                throw new Error("Response is not a valid JSON array.");
            }
        } catch (err) {
            console.error("OpenRouter API error:", err);
            setExploreError("Failed to fetch recommended courses. Please check your query or try again later.");
        } finally {
            setIsExploring(false);
        }
    };

    const handleRoadmapSearch = async (e) => {
        if (e) e.preventDefault();
        const query = roadmapSearchQuery.trim().toLowerCase();
        if (!query) return;

        setIsGeneratingRoadmap(true);
        setRoadmapError("");

        // Check if there is an exact or substring match in our presets dictionary
        let matchedKey = null;
        Object.keys(PRESET_ROADMAPS).forEach(key => {
            if (query.includes(key) || key.includes(query)) {
                matchedKey = key;
            }
        });

        if (matchedKey) {
            // Match found! Load the preset roadmap instantly
            setTimeout(() => {
                const roadmap = PRESET_ROADMAPS[matchedKey];
                setRoadmapPhases(roadmap.phases);
                setRoadmapTitle(roadmap.title);
                setSelectedRoadmapStep(1);
                setIsGeneratingRoadmap(false);
            }, 500); // Small timeout to show spinner animation for polish
            return;
        }

        // Fallback: Use AI to generate the roadmap!
        const prompt = `Return a detailed learning roadmap for the topic: "${roadmapSearchQuery}".
The roadmap must have between 4 and 6 sequential phases.
For each phase, output a JSON object with keys:
- "step": Phase number (1, 2, 3, etc.)
- "title": A short, catchy title for this phase (max 5 words)
- "desc": A 1-sentence description of the goals of this phase
- "topics": An array of 5-6 core topics or skills to learn in this phase
- "details": A detailed description (2-3 sentences) explaining how to study this phase, recommended practice projects, or resources.

Format the output strictly as a JSON array. Do not wrap the JSON in markdown code blocks like \`\`\`json. Return only the JSON string.`;

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY || ''}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "ShikshaSetu"
                },
                body: JSON.stringify({
                    model: "cohere/north-mini-code:free",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`);
            }

            const data = await response.json();
            let text = data.choices[0].message.content.trim();
            
            if (text.startsWith("```")) {
                text = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
            }

            const parsed = JSON.parse(text);
            if (Array.isArray(parsed) && parsed.length > 0) {
                const formatted = parsed.map((item, idx) => ({
                    step: idx + 1,
                    title: item.title || `Phase ${idx + 1}`,
                    desc: item.desc || "",
                    topics: Array.isArray(item.topics) ? item.topics : [],
                    details: item.details || "Practice the topics learned in this phase by building mini-projects and checking documentation."
                }));
                setRoadmapPhases(formatted);
                setRoadmapTitle(`${roadmapSearchQuery.charAt(0).toUpperCase() + roadmapSearchQuery.slice(1)} Roadmap`);
                setSelectedRoadmapStep(1);
            } else {
                throw new Error("Response is not a valid JSON array.");
            }
        } catch (err) {
            console.error("OpenRouter API error:", err);
            setRoadmapError("Failed to generate AI roadmap. Please check your query or try again later.");
        } finally {
            setIsGeneratingRoadmap(false);
        }
    };

    return (
        <div className="module-view">
            <div className="section-header flex justify-between items-center">
                <div>
                    <h2>{t("learning_hub_title", "My Learning Hub")}</h2>
                    <p>{t("learning_hub_desc", "Track your courses, certifications, and skills progress.")}</p>
                </div>
            </div>

            {/* Learning Sub Navigation Bar */}
            <div className="learning-sub-nav">
                {[
                    { label: t("categories", "Categories"), id: "categories" },
                    { label: t("roadmap", "Roadmap"), id: "roadmap" },
                    { label: t("courses", "Courses"), id: "courses" },
                    { label: t("progress", "Progress"), id: "progress" },
                    { label: t("quizzes", "Quizzes"), id: "quizes" },
                    { label: t("assignment", "Assignment"), id: "assignment" },
                    { label: t("resources", "Resources"), id: "resources" },
                ].map((sub) => (
                    <button
                        key={sub.id}
                        onClick={() => setLearningSubTab(sub.id)}
                        className={`sub-nav-btn ${learningSubTab === sub.id ? "active" : ""}`}
                    >
                        {sub.label}
                    </button>
                ))}
            </div>

            <div className="learning-tab-content">
                {learningSubTab === "categories" && (
                    <div className="categories-tab">
                        <div className="content-grid">
                            {[
                                { title: t("frontend", "Frontend Engineering"), count: 12, desc: t("desc_frontend", "HTML, CSS, modern JS, React, and responsive layouts."), color: "#4f46e5" },
                                { title: t("backend", "Backend Systems"), count: 8, desc: t("desc_backend", "NodeJS, Python, databases, APIs, and security protocols."), color: "#10b981" },
                                { title: t("uiux_design", "UI/UX Design"), count: 6, desc: t("desc_uiux", "Figma wireframing, typography, color theory, and prototyping."), color: "#f59e0b" },
                                { title: t("ml", "Machine Learning"), count: 5, desc: t("desc_ml", "Python, libraries, training models, and data algorithms."), color: "#ec4899" },
                            ].map((cat, i) => (
                                <div key={i} className="content-card category-card" style={{ borderTop: `4px solid ${cat.color}` }}>
                                    <div className="flex justify-between items-start">
                                        <h3>{cat.title}</h3>
                                        <span className="card-badge bg-slate-100 text-slate-700">{cat.count} {t("courses", "Courses")}</span>
                                    </div>
                                    <p className="card-desc mt-2">{cat.desc}</p>
                                    <div className="card-footer mt-4">
                                        <button className="card-btn" onClick={() => setLearningSubTab("courses")}>{t("browse_courses", "Browse Courses")}</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {learningSubTab === "roadmap" && (
                    <div className="roadmap-tab">
                        <div className="roadmap-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3>{roadmapTitle}</h3>
                                <p>{t("roadmap_desc", "Search a skill to see a learning pathway, and click a step for details.")}</p>
                            </div>
                            <div className="roadmap-generator-controls flex flex-wrap items-center gap-3 w-full md:w-auto">
                                <form onSubmit={handleRoadmapSearch} className="roadmap-search-container flex items-center gap-2 w-full">
                                    <div className="relative flex-grow">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search a skill (e.g. Python, React, Cybersecurity...)"
                                            value={roadmapSearchQuery}
                                            onChange={(e) => setRoadmapSearchQuery(e.target.value)}
                                            className="roadmap-search-input pl-10 pr-4 py-2 border rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#e8773f] bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-slate-200 dark:border-slate-600"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isGeneratingRoadmap || !roadmapSearchQuery.trim()}
                                        className="roadmap-generate-btn px-4 py-2 bg-[#e8773f] text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#d6652e] disabled:opacity-50"
                                    >
                                        {isGeneratingRoadmap ? (
                                            <>
                                                <Loader2 className="animate-spin" size={16} />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={16} />
                                                Search
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Popular Preset Tags */}
                        <div className="roadmap-popular-tags flex flex-wrap gap-2 items-center mt-3 mb-4">
                            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mr-1">Popular:</span>
                            {["React", "Python", "Data Science", "Cyber Security", "DevOps", "UI/UX", "Java", "Machine Learning"].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => {
                                        setRoadmapSearchQuery(tag);
                                        const query = tag.trim().toLowerCase();
                                        let matchedKey = null;
                                        Object.keys(PRESET_ROADMAPS).forEach(key => {
                                            if (query.includes(key) || key.includes(query)) {
                                                matchedKey = key;
                                            }
                                        });
                                        if (matchedKey) {
                                            const roadmap = PRESET_ROADMAPS[matchedKey];
                                            setRoadmapPhases(roadmap.phases);
                                            setRoadmapTitle(roadmap.title);
                                            setSelectedRoadmapStep(1);
                                        }
                                    }}
                                    className="roadmap-tag-btn px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer border-slate-200 dark:border-slate-700 hover:border-[#e8773f] hover:text-[#e8773f] bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        {roadmapError && (
                            <div className="roadmap-error-msg text-red-500 bg-red-50 dark:bg-red-950/30 p-4 rounded-xl border border-red-200 dark:border-red-900 text-sm mb-4">
                                {roadmapError}
                            </div>
                        )}

                        <div className="roadmap-flow mt-6 flex flex-col gap-4">
                            {roadmapPhases.map((phase) => (
                                <div
                                    key={phase.step}
                                    className={`roadmap-step-card flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all duration-250 bg-white dark:bg-slate-800 hover:translate-x-1 ${selectedRoadmapStep === phase.step ? "border-[#e8773f] bg-orange-50/10 dark:bg-orange-950/10" : "border-slate-100 dark:border-slate-700"}`}
                                    onClick={() => setSelectedRoadmapStep(phase.step)}
                                >
                                    <div className="step-circle w-9 h-9 rounded-full bg-[#e8773f] text-white flex items-center justify-center font-bold text-sm">
                                        {phase.step}
                                    </div>
                                    <div className="step-info flex-grow">
                                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-base">{phase.title}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{phase.desc}</p>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-400" />
                                </div>
                            ))}
                        </div>
                        
                        {/* Selected Roadmap Details */}
                        {roadmapPhases[selectedRoadmapStep - 1] && (
                            <div className="roadmap-details-box mt-6 p-6 border rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                <h4 className="font-semibold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                    <Play size={16} className="text-[#e8773f]" />
                                    {t("phase_details_checklist", `Phase ${selectedRoadmapStep} Details & Guide`)}
                                </h4>
                                
                                {roadmapPhases[selectedRoadmapStep - 1]?.details && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 italic leading-relaxed border-l-4 border-[#e8773f] pl-4 py-1">
                                        {roadmapPhases[selectedRoadmapStep - 1].details}
                                    </p>
                                )}

                                <ul className="roadmap-checklist mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {(roadmapPhases[selectedRoadmapStep - 1]?.topics || []).map((topic, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                            <CheckCircle size={16} className="text-emerald-500" />
                                            {topic}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {learningSubTab === "courses" && (
                    <CoursesSection
                        t={t}
                        videoSearchQuery={videoSearchQuery}
                        setVideoSearchQuery={setVideoSearchQuery}
                        filteredVideoLectures={filteredVideoLectures}
                        setSelectedVideo={setSelectedVideo}
                        setWatchProgressPercent={setWatchProgressPercent}
                        setEnrollingVideo={setEnrollingVideo}
                        getYouTubeId={getYouTubeId}
                        exploreQuery={exploreQuery}
                        setExploreQuery={setExploreQuery}
                        isExploring={isExploring}
                        exploreError={exploreError}
                        exploreCourses={exploreCourses}
                        fetchAICourses={fetchAICourses}
                        onAttemptAssessment={onAttemptAssessment}
                    />
                )}

                {learningSubTab === "progress" && (
                    <div className="progress-tab">
                        <div className="progress-stats-grid">
                            <div className="stat-box">
                                <div className="stat-value">48h</div>
                                <div className="stat-label">{t("total_learning_hours", "Total learning hours")}</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">3</div>
                                <div className="stat-label">{t("courses_enrolled", "Courses enrolled")}</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">12/15</div>
                                <div className="stat-label">{t("tasks_completed", "Tasks completed")}</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">1</div>
                                <div className="stat-label">{t("certificates_earned", "Certificates earned")}</div>
                            </div>
                        </div>

                        <div className="achievements-section mt-8">
                            <h3 className="flex items-center gap-2">
                                <Trophy size={20} className="text-amber-500" />
                                {t("achievements_title", "Unlocked Achievements & Badges")}
                            </h3>
                            <div className="badges-grid mt-4">
                                {[
                                    { title: t("badge_react", "React Pioneer"), desc: t("badge_react_desc", "Completed 90% of React fundamentals course.") },
                                    { title: t("badge_fast", "Fast Learner"), desc: t("badge_fast_desc", "Finished 5 assignments in a single week.") },
                                    { title: t("badge_design", "Design Enthusiast"), desc: t("badge_design_desc", "Earned advanced score in UI/UX assessment.") },
                                ].map((badge, i) => (
                                    <div key={i} className="badge-card">
                                        <div className="badge-icon-box">
                                            <Trophy size={22} />
                                        </div>
                                        <div className="badge-info">
                                            <h4>{badge.title}</h4>
                                            <p>{badge.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {learningSubTab === "quizes" && (
                    <div className="quizzes-tab">
                        {!quizStarted ? (
                            <div className="quiz-intro-box text-center p-8 border rounded-2xl bg-white dark:bg-slate-800">
                                <HelpCircle size={48} className="text-indigo-500 mx-auto mb-4" />
                                <h3>{t("interactive_quiz_title", "Interactive Skills Quiz")}</h3>
                                <p className="max-w-md mx-auto mt-2 text-slate-500">
                                    {t("interactive_quiz_desc", "Test your development knowledge. Complete this 3-question JavaScript & React quick-quiz and get instant scores.")}
                                </p>
                                <button
                                    className="card-btn mt-6 px-8 py-3"
                                    onClick={() => {
                                        setQuizStarted(true);
                                        setCurrentQuestion(0);
                                        setQuizAnswers({});
                                        setQuizScore(null);
                                    }}
                                >
                                    {t("start_quiz", "Start Skills Quiz")}
                                </button>
                            </div>
                        ) : quizScore !== null ? (
                            <div className="quiz-results-box text-center p-8 border rounded-2xl bg-white dark:bg-slate-800">
                                <Trophy size={48} className="text-amber-500 mx-auto mb-4" />
                                <h3>{t("quiz_completed", "Quiz Completed!")}</h3>
                                <p className="mt-2 text-xl font-bold text-slate-700 dark:text-slate-300">
                                    {t("your_score", "Your Score")}: {quizScore} / 3 ({Math.round((quizScore/3)*100)}%)
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    {quizScore === 3 ? t("excellent_score", "Excellent! You scored perfectly.") : t("good_try_score", "Good try! Review roadmaps to improve details.")}
                                </p>
                                <button
                                    className="card-btn mt-6"
                                    onClick={() => setQuizStarted(false)}
                                >
                                    {t("back_to_quizzes", "Back to Quizzes")}
                                </button>
                            </div>
                        ) : (
                            <div className="quiz-question-box p-6 border rounded-2xl bg-white dark:bg-slate-800">
                                <div className="quiz-q-header flex justify-between items-center pb-4 border-b">
                                    <span className="font-semibold">{t("question_x_of_y", `Question ${currentQuestion + 1} of 3`)}</span>
                                    <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">{t("js_react_label", "JavaScript & React")}</span>
                                </div>
                                <h4 className="text-lg font-semibold mt-4">
                                    {[
                                        t("quiz_q1", "What is the primary function of React's useState Hook?"),
                                        t("quiz_q2", "Which layout tool is designed for 1-dimensional web grids?"),
                                        t("quiz_q3", "Which JS keyword is used to pause async function executions until a promise resolves?")
                                    ][currentQuestion]}
                                </h4>
                                <div className="quiz-options-list mt-6 flex flex-col gap-3">
                                    {[
                                        [t("quiz_q1_o1", "To trigger network AJAX fetches"), t("quiz_q1_o2", "To define component routing URL paths"), t("quiz_q1_o3", "To manage and update component local state"), t("quiz_q1_o4", "To inject dynamic stylesheet attributes")],
                                        [t("quiz_q2_o1", "Floats and alignment"), t("quiz_q2_o2", "CSS Flexbox layouts"), t("quiz_q2_o3", "CSS Grid alignments"), t("quiz_q2_o4", "Absolute element positions")],
                                        ["resolve", "then", "async", "await"]
                                    ][currentQuestion].map((option, idx) => (
                                        <button
                                            key={idx}
                                            className={`quiz-option-btn p-3 text-left border rounded-xl transition-all ${
                                                quizAnswers[currentQuestion] === idx ? "selected" : ""
                                            }`}
                                            onClick={() => setQuizAnswers({ ...quizAnswers, [currentQuestion]: idx })}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                                <div className="quiz-footer flex justify-between items-center mt-6 pt-4 border-t">
                                    <button
                                        className="card-btn secondary"
                                        disabled={currentQuestion === 0}
                                        onClick={() => setCurrentQuestion(currentQuestion - 1)}
                                    >
                                        {t("previous", "Previous")}
                                    </button>
                                    <button
                                        className="card-btn"
                                        disabled={quizAnswers[currentQuestion] === undefined}
                                        onClick={() => {
                                            if (currentQuestion < 2) {
                                                setCurrentQuestion(currentQuestion + 1);
                                            } else {
                                                // Calculate score
                                                const answers = [2, 1, 3]; // Correct indexes
                                                let score = 0;
                                                answers.forEach((ans, idx) => {
                                                    if (quizAnswers[idx] === ans) score += 1;
                                                });
                                                setQuizScore(score);
                                            }
                                        }}
                                    >
                                        {currentQuestion === 2 ? t("submit_answers", "Submit Answers") : t("next_question", "Next Question")}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {learningSubTab === "assignment" && (
                    <div className="assignments-tab">
                        <div className="assignments-list flex flex-col gap-4">
                            {assignments.map((ass) => (
                                <div key={ass.id} className="content-card assignment-card-row p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="ass-info">
                                        <h4 className="font-semibold text-lg">{ass.title}</h4>
                                        <p className="text-sm text-slate-500 mt-1">{t("deadline", "Deadline")}: {ass.deadline}</p>
                                    </div>
                                    <div className="ass-actions flex items-center gap-4">
                                        <span className={`status-badge text-xs px-2.5 py-1 rounded-full font-semibold ${
                                            ass.status === "Pending" ? "bg-amber-100 text-amber-700" :
                                            ass.status === "Graded" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                                        }`}>
                                            {t(ass.status.toLowerCase(), ass.status)} {ass.grade ? `(${ass.grade})` : ""}
                                        </span>
                                        
                                        {ass.status === "Pending" && (
                                            <div className="upload-btn-wrapper relative">
                                                {uploadingAssignmentId === ass.id ? (
                                                    <span className="text-sm text-slate-400">{t("uploading", "Uploading...")}</span>
                                                ) : uploadedFile[ass.id] ? (
                                                    <span className="text-sm text-emerald-500 font-semibold flex items-center gap-1">
                                                        <CheckCircle size={16} /> {t("submitted", "Submitted")}
                                                    </span>
                                                ) : (
                                                    <label className="card-btn flex items-center gap-1.5 cursor-pointer">
                                                        <FileUp size={15} /> {t("upload_solution", "Upload Solution")}
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    setUploadingAssignmentId(ass.id);
                                                                    setTimeout(() => {
                                                                        setUploadedFile({ ...uploadedFile, [ass.id]: e.target.files[0].name });
                                                                        setUploadingAssignmentId(null);
                                                                        setAssignments(assignments.map(a => a.id === ass.id ? { ...a, status: "Submitted" } : a));
                                                                    }, 1500);
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {learningSubTab === "resources" && (
                    <div className="resources-tab">
                        <div className="content-grid">
                            {[
                                { title: "React Hooks Cheat Sheet", format: "PDF", size: "1.4 MB", type: t("reference", "Reference") },
                                { title: "Eloquent JavaScript 3rd Edition", format: "PDF/EPUB", size: "4.8 MB", type: t("ebook", "Ebook") },
                                { title: "Responsive layout rules reference", format: "ZIP", size: "520 KB", type: t("examples", "Examples") },
                                { title: "Tailwind CSS quick classes reference", format: "PDF", size: "890 KB", type: t("cheat_sheet", "Cheat Sheet") },
                            ].map((res, i) => (
                                <div key={i} className="content-card resource-card p-6 flex flex-col justify-between">
                                    <div>
                                        <span className="card-badge bg-indigo-50 text-indigo-600">{res.type}</span>
                                        <h3 className="mt-4">{res.title}</h3>
                                        <p className="text-xs text-slate-400 mt-1">{res.format} • {res.size}</p>
                                    </div>
                                    <button
                                        className="card-btn mt-6 flex items-center gap-1.5 justify-center w-full"
                                        onClick={() => {
                                            alert(`${t("downloading", "Downloading")} '${res.title}.${res.format.toLowerCase().split("/")[0]}'...`);
                                        }}
                                    >
                                        <Download size={15} /> {t("download_resource", "Download Resource")}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Premium Custom Video Player Overlay */}
            {selectedVideo && (
                <div className="video-player-overlay">
                    <div className="video-player-container">
                        <div className="video-player-header">
                            <button className="back-btn" onClick={closeVideoPlayer}>
                                <ArrowLeft size={16} /> Back to Hub
                            </button>
                            <h3>{selectedVideo.title}</h3>
                            <span className="category-tag">{selectedVideo.category}</span>
                        </div>
                        
                        <div className="video-element-wrapper" key={selectedVideo.id}>
                            {getYouTubeId(selectedVideo.video_url) ? (
                                <div id="yt-player-placeholder" className="custom-html5-video"></div>
                            ) : (
                                <video
                                    ref={videoRef}
                                    src={selectedVideo.video_url}
                                    controls
                                    onLoadedMetadata={handleVideoMetadataLoaded}
                                    onTimeUpdate={handleTimeUpdate}
                                    onPause={() => saveVideoProgress()}
                                    onEnded={handleVideoEnded}
                                    className="custom-html5-video"
                                    autoPlay
                                />
                            )}
                        </div>
                        
                        <div className="video-player-footer">
                            <div className="progress-info">
                                <span className="percentage-text">Watch Progress: {watchProgressPercent}%</span>
                                <div className="progress-bar-bg small">
                                    <div className="progress-bar-fill orange" style={{ width: `${watchProgressPercent}%` }}></div>
                                </div>
                            </div>
                            {watchProgressPercent === 100 && (
                                <button
                                    onClick={() => {
                                        closeVideoPlayer();
                                        if (onAttemptAssessment) {
                                            onAttemptAssessment(selectedVideo);
                                        }
                                    }}
                                    className="ml-4 py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                                >
                                    <span>Attempt Assessment</span>
                                    <ChevronRight size={14} />
                                </button>
                            )}
                            <div className="info-meta">
                                <span className="duration-text">Duration: {selectedVideo.duration}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Enrollment Confirmation Modal */}
            {enrollingVideo && (
                <div className="enroll-modal-overlay">
                    <motion.div className="enroll-modal-card" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
                        <div style={{ textAlign: "center" }}>
                            <GraduationCap size={48} className="text-[#e8773f]" style={{ margin: "0 auto 1.5rem auto", display: "block" }} />
                            <h3 style={{ fontSize: "1.35rem", fontWeight: "750", marginBottom: "0.75rem", color: "white" }}>
                                Do you want to enroll the course?
                            </h3>
                            <p style={{ color: "var(--text-light)", fontSize: "0.92rem", lineHeight: "1.5", marginBottom: "2rem" }}>
                                Enrolling in <strong>{enrollingVideo.title}</strong> ({enrollingVideo.category}) will start the course and track your watch progress.
                            </p>
                            <div className="enroll-modal-buttons">
                                <button type="button" className="btn-no" onClick={() => setEnrollingVideo(null)}>
                                    No
                                </button>
                                <button type="button" className="btn-yes" onClick={handleConfirmEnroll}>
                                    Yes
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
