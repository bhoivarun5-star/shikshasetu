import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen,
    Award,
    Briefcase,
    FileText,
    Sparkles,
    MessageSquare,
    Users,
    User,
    Menu,
    X,
    Sun,
    Moon,
    LogOut,
    Send,
    Check,
    Plus,
    ArrowRight,
    Play,
    CheckCircle,
    HelpCircle,
    Trophy,
    FileUp,
    Download,
    ChevronRight,
} from "lucide-react";
import BridgeScene from "../login/BridgeScene";
import "./home.css";

const PORTAL_ITEMS = [
    { id: "learning", label: "Learning", desc: "Gain certifications and skill up with interactive courses.", icon: BookOpen },
    { id: "scholarship", label: "Scholarship", desc: "Access grants and fellowships tailored to your qualifications.", icon: Award },
    { id: "jobs", label: "Jobs & Internship", desc: "Find placements, jobs, and internship opportunities.", icon: Briefcase },
    { id: "assessment", label: "Assessment", desc: "Take skill checks and test coding capabilities.", icon: FileText },
    { id: "resume", label: "Resume Builder", desc: "Build ATS-friendly resume templates in real-time.", icon: FileText },
    { id: "ai", label: "AI Career Guidance", desc: "Consult our AI advisor to map out career tracks.", icon: Sparkles },
    { id: "community", label: "Community Forum", desc: "Collaborate, ask questions, and share posts.", icon: MessageSquare },
    { id: "mentorship", label: "Mentor Connect", desc: "Schedule 1-on-1 expert mentorship calls.", icon: Users },
    { id: "profile", label: "Profile", desc: "Manage academic details and skill portfolios.", icon: User },
];
export default function Home({ user = null, onLogout = () => {} }) {
    const [activeTab, setActiveTab] = useState("home");
    const [darkMode, setDarkMode] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [learningSubTab, setLearningSubTab] = useState("courses");
    const [mobileLearningOpen, setMobileLearningOpen] = useState(false);

    // AI chat mock state
    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState([
        { role: "assistant", text: "Hello! I am your AI Career Advisor. Ask me anything about career paths, resume reviews, or technical skill development!" }
    ]);

    // Resume mock state
    const [resumeData, setResumeData] = useState({
        name: user?.fullName || "Aarav Sharma",
        title: "Frontend Developer",
        email: user?.email || "aarav@example.com",
        phone: user?.mobileNumber || "+91 98765 43210",
        skills: user?.skills || "React, JavaScript, CSS, HTML, Tailwind CSS",
        experience: "Web Development Intern at TechCorp (3 Months)\nBuilt responsive landing pages and integrated REST APIs.",
    });

    // Profile state
    const [profileSaved, setProfileSaved] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.fullName || "Aarav Sharma",
        email: user?.email || "aarav@example.com",
        phone: user?.mobileNumber || "+91 98765 43210",
        bio: user?.bio || "Passionate student learning frontend development and exploring UI/UX design. Looking for internship opportunities.",
        skills: user?.skills || "React, Node.js, Python, Figma",
    });

    // Quiz states
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizScore, setQuizScore] = useState(null);

    // Assignment states
    const [uploadingAssignmentId, setUploadingAssignmentId] = useState(null);
    const [uploadedFile, setUploadedFile] = useState({});
    const [assignments, setAssignments] = useState([
        { id: 1, title: "Responsive Layout Page", deadline: "22 June 2026", status: "Pending", grade: null },
        { id: 2, title: "React Counter with hooks", deadline: "15 June 2026", status: "Graded", grade: "9.8/10" },
        { id: 3, title: "JavaScript ES6 Exercises", deadline: "10 June 2026", status: "Submitted", grade: null }
    ]);

    // Roadmap selected step
    const [selectedRoadmapStep, setSelectedRoadmapStep] = useState(1);

    // Fetch profile from backend on load
    useEffect(() => {
        if (user) {
            fetch("/api/profile/")
                .then((res) => res.json())
                .then((data) => {
                    if (data.success && data.profile) {
                        setProfileData(data.profile);
                        setResumeData(prev => ({
                            ...prev,
                            name: data.profile.name || prev.name,
                            email: data.profile.email || prev.email,
                            phone: data.profile.phone || prev.phone,
                            skills: data.profile.skills || prev.skills,
                        }));
                    }
                })
                .catch((err) => console.error("Error fetching profile:", err));
        }
    }, [user]);

    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = { role: "user", text: chatInput };
        setChatMessages((prev) => [...prev, userMsg]);
        setChatInput("");

        // Simulate AI Response
        setTimeout(() => {
            let aiText = "That's a great question! For a path in that direction, I recommend mastering React, building 3 portfolio projects, and practicing SQL database queries.";
            if (chatInput.toLowerCase().includes("resume")) {
                aiText = "Based on your resume details, I suggest emphasizing your achievements. Try formatting your web development internship bullets to start with action words like 'Led development' or 'Optimized load times by 20%'.";
            } else if (chatInput.toLowerCase().includes("job") || chatInput.toLowerCase().includes("intern")) {
                aiText = "Currently, React developer roles are high in demand. I recommend exploring our 'Jobs & Internship' tab to apply to the Product Design or Frontend Intern positions!";
            }
            setChatMessages((prev) => [...prev, { role: "assistant", text: aiText }]);
        }, 1000);
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/profile/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profileData),
            });
            const data = await response.json();
            if (data.success) {
                setProfileSaved(true);
                setTimeout(() => setProfileSaved(false), 3000);
            } else {
                alert(data.message || "Failed to save profile.");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving profile details.");
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/logout/", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            const data = await response.json();
            if (data.success) {
                onLogout();
            } else {
                console.error("Logout failed:", data.message);
            }
        } catch (err) {
            console.error("Error logging out:", err);
        }
    };

    const renderModuleContent = () => {
        switch (activeTab) {
            case "learning":
                return (
                    <div className="module-view">
                        <div className="section-header flex justify-between items-center">
                            <div>
                                <h2>My Learning Hub</h2>
                                <p>Track your courses, certifications, and skills progress.</p>
                            </div>
                        </div>

                        {/* Learning Sub Navigation Bar */}
                        <div className="learning-sub-nav">
                            {[
                                { label: "Categories", id: "categories" },
                                { label: "Roadmap", id: "roadmap" },
                                { label: "Courses", id: "courses" },
                                { label: "Progress", id: "progress" },
                                { label: "Quizzes", id: "quizes" },
                                { label: "Assignment", id: "assignment" },
                                { label: "Resources", id: "resources" },
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
                                            { title: "Frontend Engineering", count: 12, desc: "HTML, CSS, modern JS, React, and responsive layouts.", color: "#4f46e5" },
                                            { title: "Backend Systems", count: 8, desc: "NodeJS, Python, databases, APIs, and security protocols.", color: "#10b981" },
                                            { title: "UI/UX Design", count: 6, desc: "Figma wireframing, typography, color theory, and prototyping.", color: "#f59e0b" },
                                            { title: "Machine Learning", count: 5, desc: "Python, libraries, training models, and data algorithms.", color: "#ec4899" },
                                        ].map((cat, i) => (
                                            <div key={i} className="content-card category-card" style={{ borderTop: `4px solid ${cat.color}` }}>
                                                <div className="flex justify-between items-start">
                                                    <h3>{cat.title}</h3>
                                                    <span className="card-badge bg-slate-100 text-slate-700">{cat.count} Courses</span>
                                                </div>
                                                <p className="card-desc mt-2">{cat.desc}</p>
                                                <div className="card-footer mt-4">
                                                    <button className="card-btn" onClick={() => setLearningSubTab("courses")}>Browse Courses</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {learningSubTab === "roadmap" && (
                                <div className="roadmap-tab">
                                    <div className="roadmap-header">
                                        <h3>Frontend Development Roadmap</h3>
                                        <p>Click on any phase to view detail guides, topics, and checkpoints.</p>
                                    </div>
                                    <div className="roadmap-flow">
                                        {[
                                            { step: 1, title: "Web Foundations", desc: "HTML5 semantic tags, CSS layouts (Flexbox & Grid), responsive design.", topics: ["HTML5 semantic tags", "CSS layouts (Flexbox, Grid)", "Responsive media queries", "CSS variables"] },
                                            { step: 2, title: "JavaScript Core", desc: "DOM manipulation, asynchronous fetching, fetch APIs, arrays callbacks.", topics: ["DOM dynamic scripts", "ES6+ variables & functions", "Promises & async/await", "Fetch APIs & HTTP requests"] },
                                            { step: 3, title: "React Framework", desc: "React interactive components, state, hooks (useState, useEffect).", topics: ["JSX & Components props", "useState & useEffect hooks", "React Router", "Vite & npm environments"] },
                                            { step: 4, title: "Testing & Deployment", desc: "Vite, Git source branching, deploying static sites (Netlify, Vercel).", topics: ["Git & GitHub source codes", "Vercel / Netlify cloud deploy", "Performance audits", "Portfolio projects"] },
                                        ].map((phase) => (
                                            <div
                                                key={phase.step}
                                                className={`roadmap-step-card ${selectedRoadmapStep === phase.step ? "selected" : ""}`}
                                                onClick={() => setSelectedRoadmapStep(phase.step)}
                                            >
                                                <div className="step-circle">{phase.step}</div>
                                                <div className="step-info">
                                                    <h4>{phase.title}</h4>
                                                    <p>{phase.desc}</p>
                                                </div>
                                                <ChevronRight size={18} className="step-chevron" />
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Selected Roadmap Details */}
                                    <div className="roadmap-details-box mt-6 p-6 border rounded-2xl bg-white dark:bg-slate-800">
                                        <h4 className="font-semibold text-lg flex items-center gap-2">
                                            <Play size={16} className="text-[#e8773f]" />
                                            Phase {selectedRoadmapStep} Details & Checklist
                                        </h4>
                                        <ul className="roadmap-checklist mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {[
                                                { step: 1, topics: ["HTML5 semantics", "CSS layout rules", "Media queries", "CSS Flexbox", "CSS Grid", "Animations"] },
                                                { step: 2, topics: ["DOM manipulations", "Array methods (map, filter)", "ES6 modules", "Fetch APIs", "Error handling", "Storage (localStorage)"] },
                                                { step: 3, topics: ["Components props", "State management", "React custom hooks", "React router paths", "Context API", "Forms validations"] },
                                                { step: 4, topics: ["Git workflows", "Vite builds", "Netlify/Vercel hostings", "Lighthouse testing", "Portfolio creations", "Continuous integration"] }
                                            ][selectedRoadmapStep - 1].topics.map((topic, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                    <CheckCircle size={16} className="text-emerald-500" />
                                                    {topic}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {learningSubTab === "courses" && (
                                <div className="content-grid">
                                    {[
                                        { title: "Full Stack Web Development", progress: 68, category: "Engineering", level: "Intermediate" },
                                        { title: "Introduction to Machine Learning", progress: 42, category: "Data Science", level: "Beginner" },
                                        { title: "UI/UX Design Masterclass", progress: 90, category: "Design", level: "Advanced" },
                                    ].map((course, i) => (
                                        <div key={i} className="content-card">
                                            <div className="card-badge">{course.category}</div>
                                            <h3>{course.title}</h3>
                                            <div className="progress-container">
                                                <div className="progress-bar-bg">
                                                    <div className="progress-bar-fill" style={{ width: `${course.progress}%` }}></div>
                                                </div>
                                                <span>{course.progress}% Completed</span>
                                            </div>
                                            <div className="card-footer">
                                                <span className="card-meta">{course.level}</span>
                                                <button className="card-btn">Continue</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {learningSubTab === "progress" && (
                                <div className="progress-tab">
                                    <div className="progress-stats-grid">
                                        <div className="stat-box">
                                            <div className="stat-value">48h</div>
                                            <div className="stat-label">Total learning hours</div>
                                        </div>
                                        <div className="stat-box">
                                            <div className="stat-value">3</div>
                                            <div className="stat-label">Courses enrolled</div>
                                        </div>
                                        <div className="stat-box">
                                            <div className="stat-value">12/15</div>
                                            <div className="stat-label">Tasks completed</div>
                                        </div>
                                        <div className="stat-box">
                                            <div className="stat-value">1</div>
                                            <div className="stat-label">Certificates earned</div>
                                        </div>
                                    </div>

                                    <div className="achievements-section mt-8">
                                        <h3 className="flex items-center gap-2">
                                            <Trophy size={20} className="text-amber-500" />
                                            Unlocked Achievements & Badges
                                        </h3>
                                        <div className="badges-grid mt-4">
                                            {[
                                                { title: "React Pioneer", desc: "Completed 90% of React fundamentals course.", icon: Trophy },
                                                { title: "Fast Learner", desc: "Finished 5 assignments in a single week.", icon: Trophy },
                                                { title: "Design Enthusiast", desc: "Earned advanced score in UI/UX assessment.", icon: Trophy },
                                            ].map((badge, i) => (
                                                <div key={i} className="badge-card">
                                                    <div className="badge-icon-box">
                                                        <badge.icon size={22} />
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
                                            <h3>Interactive Skills Quiz</h3>
                                            <p className="max-w-md mx-auto mt-2 text-slate-500">
                                                Test your development knowledge. Complete this 3-question JavaScript & React quick-quiz and get instant scores.
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
                                                Start Skills Quiz
                                            </button>
                                        </div>
                                    ) : quizScore !== null ? (
                                        <div className="quiz-results-box text-center p-8 border rounded-2xl bg-white dark:bg-slate-800">
                                            <Trophy size={48} className="text-amber-500 mx-auto mb-4" />
                                            <h3>Quiz Completed!</h3>
                                            <p className="mt-2 text-xl font-bold text-slate-700 dark:text-slate-300">
                                                Your Score: {quizScore} / 3 ({Math.round((quizScore/3)*100)}%)
                                            </p>
                                            <p className="mt-2 text-sm text-slate-500">
                                                {quizScore === 3 ? "Excellent! You scored perfectly." : "Good try! Review roadmaps to improve details."}
                                            </p>
                                            <button
                                                className="card-btn mt-6"
                                                onClick={() => setQuizStarted(false)}
                                            >
                                                Back to Quizzes
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="quiz-question-box p-6 border rounded-2xl bg-white dark:bg-slate-800">
                                            <div className="quiz-q-header flex justify-between items-center pb-4 border-b">
                                                <span className="font-semibold">Question {currentQuestion + 1} of 3</span>
                                                <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">JavaScript & React</span>
                                            </div>
                                            <h4 className="text-lg font-semibold mt-4">
                                                {[
                                                    "What is the primary function of React's useState Hook?",
                                                    "Which layout tool is designed for 1-dimensional web grids?",
                                                    "Which JS keyword is used to pause async function executions until a promise resolves?"
                                                ][currentQuestion]}
                                            </h4>
                                            <div className="quiz-options-list mt-6 flex flex-col gap-3">
                                                {[
                                                    ["To trigger network AJAX fetches", "To define component routing URL paths", "To manage and update component local state", "To inject dynamic stylesheet attributes"],
                                                    ["Floats and alignment", "CSS Flexbox layouts", "CSS Grid alignments", "Absolute element positions"],
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
                                                    Previous
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
                                                    {currentQuestion === 2 ? "Submit Answers" : "Next Question"}
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
                                                    <p className="text-sm text-slate-500 mt-1">Deadline: {ass.deadline}</p>
                                                </div>
                                                <div className="ass-actions flex items-center gap-4">
                                                    <span className={`status-badge text-xs px-2.5 py-1 rounded-full font-semibold ${
                                                        ass.status === "Pending" ? "bg-amber-100 text-amber-700" :
                                                        ass.status === "Graded" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                                                    }`}>
                                                        {ass.status} {ass.grade ? `(${ass.grade})` : ""}
                                                    </span>
                                                    
                                                    {ass.status === "Pending" && (
                                                        <div className="upload-btn-wrapper relative">
                                                            {uploadingAssignmentId === ass.id ? (
                                                                <span className="text-sm text-slate-400">Uploading...</span>
                                                            ) : uploadedFile[ass.id] ? (
                                                                <span className="text-sm text-emerald-500 font-semibold flex items-center gap-1">
                                                                    <CheckCircle size={16} /> Submitted
                                                                </span>
                                                            ) : (
                                                                <label className="card-btn flex items-center gap-1.5 cursor-pointer">
                                                                    <FileUp size={15} /> Upload Solution
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
                                            { title: "React Hooks Cheat Sheet", format: "PDF", size: "1.4 MB", type: "Reference" },
                                            { title: "Eloquent JavaScript 3rd Edition", format: "PDF/EPUB", size: "4.8 MB", type: "Ebook" },
                                            { title: "Responsive layout rules reference", format: "ZIP", size: "520 KB", type: "Examples" },
                                            { title: "Tailwind CSS quick classes reference", format: "PDF", size: "890 KB", type: "Cheat Sheet" },
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
                                                        alert(`Downloading '${res.title}.${res.format.toLowerCase().split("/")[0]}'...`);
                                                    }}
                                                >
                                                    <Download size={15} /> Download Resource
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case "scholarship":
                return (
                    <div className="module-view">
                        <div className="section-header">
                            <h2>Scholarship & Fellowships</h2>
                            <p>Apply for financial aid and education rewards tailored for you.</p>
                        </div>
                        <div className="content-grid">
                            {[
                                { title: "National Innovation Scholarship", reward: "₹50,000", deadline: "15 July 2026", criteria: "Engineering Students" },
                                { title: "Women in Tech Fellowship", reward: "Full Tuition", deadline: "28 July 2026", criteria: "Female CS Students" },
                                { title: "E-Learn Merit Reward", reward: "₹25,000", deadline: "10 August 2026", criteria: "GPA > 8.5" },
                            ].map((scholarship, i) => (
                                <div key={i} className="content-card scholarship-card">
                                    <h3>{scholarship.title}</h3>
                                    <div className="price-tag">{scholarship.reward}</div>
                                    <p className="card-desc">Eligibility: {scholarship.criteria}</p>
                                    <div className="card-footer">
                                        <span className="card-meta">Deadline: {scholarship.deadline}</span>
                                        <button className="card-btn secondary">Apply Now</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case "jobs":
                return (
                    <div className="module-view">
                        <div className="section-header">
                            <h2>Jobs & Internships</h2>
                            <p>Find placement matches matching your skillset.</p>
                        </div>
                        <div className="content-grid">
                            {[
                                { role: "Frontend Development Intern", company: "TechCorp", pay: "₹20,000/mo", type: "Remote", duration: "6 Months" },
                                { role: "Junior Software Engineer", company: "DevStudio", pay: "₹6.5 LPA", type: "On-site (Bangalore)", duration: "Full-time" },
                                { role: "Product Design Intern", company: "Designly", pay: "₹15,000/mo", type: "Remote", duration: "3 Months" },
                            ].map((job, i) => (
                                <div key={i} className="content-card job-card">
                                    <div className="company-logo">{job.company[0]}</div>
                                    <h3>{job.role}</h3>
                                    <span className="company-name">{job.company}</span>
                                    <div className="job-tags">
                                        <span>{job.type}</span>
                                        <span>{job.pay}</span>
                                        <span>{job.duration}</span>
                                    </div>
                                    <button className="card-btn w-full mt-4">Easy Apply</button>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case "assessment":
                return (
                    <div className="module-view">
                        <div className="section-header">
                            <h2>Skills Assessments</h2>
                            <p>Verify your expertise to get certified credentials on your profile.</p>
                        </div>
                        <div className="content-grid">
                            {[
                                { name: "JavaScript Core Basics", questions: 25, duration: "30 Mins", difficulty: "Beginner" },
                                { name: "React Framework Proficiency", questions: 30, duration: "45 Mins", difficulty: "Intermediate" },
                                { name: "Python Coding Skills", questions: 20, duration: "40 Mins", difficulty: "Beginner" },
                            ].map((test, i) => (
                                <div key={i} className="content-card assessment-card">
                                    <h3>{test.name}</h3>
                                    <div className="assessment-meta">
                                        <div>📋 {test.questions} Questions</div>
                                        <div>⏱️ {test.duration}</div>
                                        <div>📶 {test.difficulty}</div>
                                    </div>
                                    <button className="card-btn mt-4">Start Assessment</button>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case "resume":
                return (
                    <div className="module-view">
                        <div className="section-header">
                            <h2>Resume Builder</h2>
                            <p>Create a clean, recruiter-friendly resume template.</p>
                        </div>
                        <div className="resume-builder-container">
                            <div className="resume-editor">
                                <div className="editor-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={resumeData.name}
                                        onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                                    />
                                </div>
                                <div className="editor-group">
                                    <label>Professional Title</label>
                                    <input
                                        type="text"
                                        value={resumeData.title}
                                        onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                                    />
                                </div>
                                <div className="editor-row">
                                    <div className="editor-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            value={resumeData.email}
                                            onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="editor-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="text"
                                            value={resumeData.phone}
                                            onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="editor-group">
                                    <label>Skills (Comma Separated)</label>
                                    <input
                                        type="text"
                                        value={resumeData.skills}
                                        onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
                                    />
                                </div>
                                <div className="editor-group">
                                    <label>Work/Project Experience</label>
                                    <textarea
                                        rows="4"
                                        value={resumeData.experience}
                                        onChange={(e) => setResumeData({ ...resumeData, experience: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="resume-preview">
                                <h3>Live Preview</h3>
                                <div className="resume-document">
                                    <div className="resume-header">
                                        <h4>{resumeData.name || "Your Name"}</h4>
                                        <p>{resumeData.title || "Your Title"}</p>
                                        <div className="resume-contact">
                                            <span>{resumeData.email}</span>
                                            <span>{resumeData.phone}</span>
                                        </div>
                                    </div>
                                    <div className="resume-body">
                                        <h5>Key Skills</h5>
                                        <p>{resumeData.skills || "Add your skills..."}</p>

                                        <h5>Experience</h5>
                                        <div className="experience-block">
                                            <p className="experience-desc">{resumeData.experience || "Add your work details..."}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "ai":
                return (
                    <div className="module-view">
                        <div className="section-header">
                            <h2>AI Career Guidance</h2>
                            <p>Chat with our smart AI assistant to clarify doubts, review paths, or evaluate skills.</p>
                        </div>
                        <div className="chat-container">
                            <div className="chat-body">
                                {chatMessages.map((msg, idx) => (
                                    <div key={idx} className={`chat-bubble-wrapper ${msg.role}`}>
                                        <div className="chat-bubble">
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleChatSubmit} className="chat-input-bar">
                                <input
                                    type="text"
                                    placeholder="Type your question about career options, skill building..."
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                />
                                <button type="submit" className="chat-send-btn">
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </div>
                );

            case "community":
                return (
                    <div className="module-view">
                        <div className="section-header">
                            <h2>Community Forum</h2>
                            <p>Interact with peers, ask questions, and share knowledge with other learners.</p>
                        </div>
                        <div className="forum-posts-list">
                            {[
                                { title: "How to prepare for coding interviews in 3 months?", author: "Rohan Patel", tags: ["interviews", "dsa"], replies: 14, likes: 32 },
                                { title: "Best online courses/books for learning React Hooks?", author: "Deepa Verma", tags: ["react", "frontend"], replies: 8, likes: 19 },
                                { title: "My experience applying to remote frontend internships", author: "Aarav Sharma", tags: ["internship", "remote"], replies: 22, likes: 54 },
                            ].map((post, i) => (
                                <div key={i} className="forum-card">
                                    <h3>{post.title}</h3>
                                    <p className="forum-meta">Posted by: <strong>{post.author}</strong></p>
                                    <div className="forum-footer">
                                        <div className="forum-tags">
                                            {post.tags.map((t, idx) => <span key={idx}>#{t}</span>)}
                                        </div>
                                        <div className="forum-stats">
                                            <span>👍 {post.likes}</span>
                                            <span>💬 {post.replies} Replies</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button className="add-post-btn">
                                <Plus size={16} /> Start a New Topic
                            </button>
                        </div>
                    </div>
                );

            case "mentorship":
                return (
                    <div className="module-view">
                        <div className="section-header">
                            <h2>Mentor Connect</h2>
                            <p>Book 1-on-1 calls with experienced professionals in your field.</p>
                        </div>
                        <div className="content-grid">
                            {[
                                { name: "Dr. Sarah Connor", role: "Senior ML Engineer at Google", rating: "4.9 (42 reviews)", domain: "Artificial Intelligence" },
                                { name: "Alex Rivera", role: "Product Lead at Stripe", rating: "4.8 (29 reviews)", domain: "Product Management" },
                                { name: "Tanya Sen", role: "UX Design Consultant", rating: "5.0 (54 reviews)", domain: "UI/UX Design" },
                            ].map((mentor, i) => (
                                <div key={i} className="content-card mentor-card">
                                    <div className="mentor-avatar">{mentor.name.split(" ").map(w => w[0]).join("")}</div>
                                    <h3>{mentor.name}</h3>
                                    <p className="mentor-role">{mentor.role}</p>
                                    <div className="mentor-badge">{mentor.domain}</div>
                                    <div className="card-footer mt-4">
                                        <span className="card-meta">⭐ {mentor.rating}</span>
                                        <button className="card-btn">Book Session</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case "profile":
                return (
                    <div className="module-view">
                        <div className="section-header">
                            <h2>Profile Settings</h2>
                            <p>Manage your academic details and skill portfolios.</p>
                        </div>
                        <div className="profile-container-inner">
                            <form onSubmit={handleProfileSave} className="profile-form">
                                <AnimatePresence>
                                    {profileSaved && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="success-alert"
                                        >
                                            <Check size={16} /> Changes saved successfully!
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="editor-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="editor-row">
                                    <div className="editor-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="editor-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="editor-group">
                                    <label>Bio / Description</label>
                                    <textarea
                                        rows="4"
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="editor-group">
                                    <label>Skills & Interests</label>
                                    <input
                                        type="text"
                                        value={profileData.skills}
                                        onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="card-btn save-profile-btn mt-2">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={`home-wrapper ${darkMode ? "dark-theme" : ""}`}>
            {/* Frosted Glass Header Navbar */}
            <header className="home-header">
                <div className="header-container">
                    <button
                        className="logo-btn"
                        onClick={() => setActiveTab("home")}
                        aria-label="Go to home landing page"
                    >
                        <h1 className="logo-text">ShikshaSetu</h1>
                    </button>
                    {/* Desktop Navigation Link Row */}
                    <nav className="desktop-nav">
                        {PORTAL_ITEMS.map((item) => {
                            if (item.id === "learning") {
                                return (
                                    <div key={item.id} className="nav-dropdown-wrapper">
                                        <button
                                            onClick={() => {
                                                setActiveTab(item.id);
                                                setLearningSubTab("courses");
                                            }}
                                            className={`nav-link-btn ${activeTab === item.id ? "active" : ""}`}
                                        >
                                            {item.label}
                                        </button>
                                        <div className="nav-dropdown-menu">
                                            {[
                                                { label: "Learning Categories", subId: "categories" },
                                                { label: "Learning Roadmap", subId: "roadmap" },
                                                { label: "Courses", subId: "courses" },
                                                { label: "Progress", subId: "progress" },
                                                { label: "Quizzes", subId: "quizes" },
                                                { label: "Assignment", subId: "assignment" },
                                                { label: "Resources", subId: "resources" },
                                            ].map((subItem) => (
                                                <button
                                                    key={subItem.subId}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveTab("learning");
                                                        setLearningSubTab(subItem.subId);
                                                    }}
                                                    className="dropdown-item-btn"
                                                >
                                                    {subItem.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`nav-link-btn ${activeTab === item.id ? "active" : ""}`}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="header-actions">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="theme-action-btn"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <div className="profile-badge-nav">
                            <div className="avatar-letter">
                                {profileData.name ? profileData.name.split(" ").map(w => w[0]).join("").toUpperCase() : "AS"}
                            </div>
                            <span className="profile-label">
                                {profileData.name ? profileData.name.split(" ")[0] : "Aarav"}
                            </span>
                        </div>

                        {user && (
                            <button
                                onClick={handleLogout}
                                className="logout-action-btn"
                                aria-label="Log out"
                                title="Log out"
                            >
                                <LogOut size={18} />
                            </button>
                        )}

                        <button
                            className="mobile-hamburger"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Open navigation menu"
                        >
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mobile-nav-drawer"
                    >
                        {PORTAL_ITEMS.map((item) => {
                            if (item.id === "learning") {
                                return (
                                    <div key={item.id} className="mobile-nested-nav">
                                        <button
                                            onClick={() => {
                                                setMobileLearningOpen(!mobileLearningOpen);
                                            }}
                                            className={`mobile-nav-link ${activeTab === item.id ? "active" : ""} flex justify-between items-center`}
                                        >
                                            <span>{item.label}</span>
                                            <span className="text-xs">{mobileLearningOpen ? "▲" : "▼"}</span>
                                        </button>
                                        {mobileLearningOpen && (
                                            <div className="mobile-sub-menu pl-4 flex flex-col gap-2 py-2">
                                                {[
                                                    { label: "Learning Categories", subId: "categories" },
                                                    { label: "Learning Roadmap", subId: "roadmap" },
                                                    { label: "Courses", subId: "courses" },
                                                    { label: "Progress", subId: "progress" },
                                                    { label: "Quizzes", subId: "quizes" },
                                                    { label: "Assignment", subId: "assignment" },
                                                    { label: "Resources", subId: "resources" },
                                                ].map((subItem) => (
                                                    <button
                                                        key={subItem.subId}
                                                        onClick={() => {
                                                            setActiveTab("learning");
                                                            setLearningSubTab(subItem.subId);
                                                            setMobileMenuOpen(false);
                                                        }}
                                                        className="mobile-sub-link py-2 text-left text-sm text-slate-500 hover:text-slate-955"
                                                    >
                                                        {subItem.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`mobile-nav-link ${activeTab === item.id ? "active" : ""}`}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                        {user && (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                                className="mobile-nav-link text-rose-500 flex items-center gap-2 mt-4 pt-4 border-t border-slate-100"
                            >
                                <LogOut size={16} /> Log Out
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Main Content Portal */}
            <main className="portal-main">
                <AnimatePresence mode="wait">
                    {activeTab === "home" ? (
                        /* Hero Landing view */
                        <motion.div
                            key="hero-landing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="hero-section-wrapper"
                        >
                            {/* Hero banner */}
                            <section className="hero-banner">
                                <div className="hero-left">
                                    <div className="hero-badge">SHIKSHASETU PORTAL</div>
                                    <h2>The Bridge From Learning To Career Success</h2>
                                    <p>
                                        Access customized skills classes, verify capability checks, search job placements, edit ATS resumes, consult AI career advice, and connect with global mentors.
                                    </p>
                                    <div className="hero-ctas">
                                        <button
                                            onClick={() => setActiveTab("learning")}
                                            className="cta-primary-btn"
                                        >
                                            Explore Courses <ArrowRight size={16} />
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("ai")}
                                            className="cta-secondary-btn"
                                        >
                                            Consult AI Advisor
                                        </button>
                                    </div>
                                </div>

                                <div className="hero-right">
                                    <div className="bridge-visual-frame">
                                        <BridgeScene className="visual-svg" />
                                    </div>
                                </div>
                            </section>

                            {/* Features grid */}
                            <section className="portal-features-showcase">
                                <h3>Quick Access Modules</h3>
                                <div className="portal-grid">
                                    {PORTAL_ITEMS.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <div
                                                key={item.id}
                                                className="portal-module-card"
                                                onClick={() => setActiveTab(item.id)}
                                            >
                                                <div className="module-icon-circle">
                                                    <Icon size={20} />
                                                </div>
                                                <h4>{item.label}</h4>
                                                <p>{item.desc}</p>
                                                <div className="module-action-link">
                                                    Open Hub <ArrowRight size={14} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        </motion.div>
                    ) : (
                        /* Module view wrapper */
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                            className="module-container-box"
                        >
                            {/* Breadcrumbs / Back button */}
                            <div className="breadcrumb-nav">
                                <button
                                    onClick={() => setActiveTab("home")}
                                    className="back-home-link"
                                >
                                    Home
                                </button>
                                <span className="separator">/</span>
                                <span className="current-location">
                                    {PORTAL_ITEMS.find((t) => t.id === activeTab)?.label}
                                </span>
                            </div>

                            {/* Render active sub-page content */}
                            {renderModuleContent()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="portal-footer">
                <div className="footer-content">
                    <p>© 2026 ShikshaSetu Portal. Built to bridge skills, education, and career paths.</p>
                </div>
            </footer>
        </div>
    );
}
