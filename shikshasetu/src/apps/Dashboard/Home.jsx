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
    ArrowRight,
} from "lucide-react";
import BridgeScene from "../login/BridgeScene";
import Learning from "../Learning/Learning";
import Scholarship from "../Scholarship/Scholarship";
import Jobs from "../Jobs/Jobs";
import Assessment from "../Assessment/Assessment";
import Resume from "../Resume/Resume";
import AI from "../AI/AI";
import Community from "../Community/Community";
import Mentorship from "../Mentorship/Mentorship";
import Profile from "../Profile/Profile";
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
export default function Home({ user = null, onLogout = () => {}, language = "en", setLanguage = () => {}, t = (k) => k }) {
    const [activeTab, setActiveTab] = useState("home");
    const [darkMode, setDarkMode] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [learningSubTab, setLearningSubTab] = useState("courses");
    const [assessmentCourse, setAssessmentCourse] = useState(null);
    const [mobileLearningOpen, setMobileLearningOpen] = useState(false);

    const handleAttemptAssessment = (course) => {
        setAssessmentCourse(course);
        setActiveTab("assessment");
    };
    // Controls visibility of the learning dropdown on hover (desktop)
    const [learningDropdownOpen, setLearningDropdownOpen] = useState(false);

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
    const [profileData, setProfileData] = useState({
        name: user?.fullName || "Aarav Sharma",
        email: user?.email || "aarav@example.com",
        phone: user?.mobileNumber || "+91 98765 43210",
        bio: user?.bio || "Passionate student learning frontend development and exploring UI/UX design. Looking for internship opportunities.",
        skills: user?.skills || "React, Node.js, Python, Figma",
        badges: []
    });

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
                    <Learning
                        learningSubTab={learningSubTab}
                        setLearningSubTab={setLearningSubTab}
                        t={t}
                        onAttemptAssessment={handleAttemptAssessment}
                    />
                );

            case "scholarship":
                return <Scholarship t={t} />;

            case "jobs":
                return <Jobs />;

            case "assessment":
                return (
                    <Assessment
                        assessmentCourse={assessmentCourse}
                        clearAssessmentCourse={() => setAssessmentCourse(null)}
                        onBadgeEarned={() => {
                            fetch("/api/profile/")
                                .then((res) => res.json())
                                .then((data) => {
                                    if (data.success && data.profile) {
                                        setProfileData(data.profile);
                                    }
                                })
                                .catch((err) => console.error("Error updating profile after badge earned:", err));
                        }}
                    />
                );

            case "resume":
                return <Resume resumeData={resumeData} setResumeData={setResumeData} />;

            case "ai":
                return <AI />;

            case "community":
                return <Community userName={profileData.name || user?.fullName || "Aarav Sharma"} />;

            case "mentorship":
                return <Mentorship />;

            case "profile":
                return <Profile profileData={profileData} setProfileData={setProfileData} />;

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
                    {/* Added scrollable wrapper for overflow handling */}
                    <nav className="desktop-nav scrollable-nav" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
                        {PORTAL_ITEMS.map((item) => {
                            if (item.id === "learning") {
                                return (
                                    <div
                                        key={item.id}
                                        className="nav-dropdown-wrapper"
                                        onMouseEnter={() => setLearningDropdownOpen(true)}
                                        onMouseLeave={() => setLearningDropdownOpen(false)}
                                    >
                                        <button
                                            onClick={() => {
                                                setActiveTab(item.id);
                                                setLearningSubTab("courses");
                                            }}
                                            className={`nav-link-btn ${activeTab === item.id ? "active" : ""}`}
                                        >
                                            {t(item.id)}
                                        </button>
                                        {/* Show dropdown on hover */}
                                        {learningDropdownOpen && (
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
                                                        {t(subItem.subId)}
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
                                    onClick={() => setActiveTab(item.id)}
                                    className={`nav-link-btn ${activeTab === item.id ? "active" : ""}`}
                                >
                                    {t(item.id)}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="header-actions">
                        <div className="language-selector-container">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="language-selector-select"
                                aria-label="Select Language"
                            >
                                <option value="en">English</option>
                                <option value="hi">हिंदी</option>
                                <option value="mr">मराठी</option>
                            </select>
                        </div>

                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="theme-action-btn"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <div 
                            className="profile-badge-nav"
                            onClick={() => setActiveTab("profile")}
                        >
                            {profileData.profile_image ? (
                                <div 
                                    className="avatar-image-nav" 
                                    style={{ backgroundImage: `url(${profileData.profile_image})` }} 
                                />
                            ) : (
                                <div className="avatar-letter">
                                    {profileData.name ? profileData.name.split(" ").map(w => w[0]).join("").toUpperCase() : "AS"}
                                </div>
                            )}
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
                                            <span>{t(item.id)}</span>
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
                                                        {t(subItem.subId)}
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
                                    {t(item.id)}
                                </button>
                            );
                        })}

                        {/* Mobile Language Selector */}
                        <div className="mobile-language-selector-row">
                            <span className="mobile-language-label">{t("language")}</span>
                            <select
                                value={language}
                                onChange={(e) => {
                                    setLanguage(e.target.value);
                                    setMobileMenuOpen(false);
                                }}
                                className="language-selector-select mobile-select"
                                aria-label="Select Language"
                            >
                                <option value="en">English</option>
                                <option value="hi">हिंदी</option>
                                <option value="mr">मराठी</option>
                            </select>
                        </div>

                        {user && (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                                className="mobile-nav-link text-rose-500 flex items-center gap-2 mt-4 pt-4 border-t border-slate-100"
                            >
                                <LogOut size={16} /> {t("logout")}
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
                                    <div className="hero-badge">{t("hero_badge")}</div>
                                    <h2>{t("hero_title")}</h2>
                                    <p>{t("hero_desc")}</p>
                                    <div className="hero-ctas">
                                        <button
                                            onClick={() => setActiveTab("learning")}
                                            className="cta-primary-btn"
                                        >
                                            {t("hero_cta_explore")} <ArrowRight size={16} />
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("ai")}
                                            className="cta-secondary-btn"
                                        >
                                            {t("hero_cta_consult")}
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
                                <h3>{t("quick_access_title")}</h3>
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
                                                <h4>{t(item.id)}</h4>
                                                <p>{t("desc_" + item.id)}</p>
                                                <div className="module-action-link">
                                                    {t("open_hub")} <ArrowRight size={14} />
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
                                    {t("home")}
                                </button>
                                <span className="separator">/</span>
                                <span className="current-location">
                                    {t(activeTab)}
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