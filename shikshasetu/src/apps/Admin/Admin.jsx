import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Briefcase,
    Award,
    Shield,
    Trash2,
    Plus,
    BarChart3,
    ArrowRight,
    LogOut,
    UserCheck,
    AlertCircle,
    Video
} from "lucide-react";
import "./admin.css";

// Sample initial data for mockup displays
const INITIAL_JOBS = [
    { id: 1, role: "Frontend Development Intern", company: "TechCorp", pay: "₹20,000/mo", type: "Remote", duration: "6 Months" },
    { id: 2, role: "Junior Software Engineer", company: "DevStudio", pay: "₹6.5 LPA", type: "On-site (Bangalore)", duration: "Full-time" },
    { id: 3, role: "Product Design Intern", company: "Designly", pay: "₹15,000/mo", type: "Remote", duration: "3 Months" },
];

const INITIAL_SCHOLARSHIPS = [
    { id: 1, title: "National Innovation Scholarship", reward: "₹50,000", deadline: "15 July 2026", criteria: "Engineering Students" },
    { id: 2, title: "Women in Tech Fellowship", reward: "Full Tuition", deadline: "28 July 2026", criteria: "Female CS Students" },
    { id: 3, title: "E-Learn Merit Reward", reward: "₹25,000", deadline: "10 August 2026", criteria: "GPA > 8.5" },
];

export default function Admin() {
    const SUPABASE_URL = "https://ubojazlxquvreaexiddi.supabase.co";
    const SUPABASE_KEY = "sb_publishable_JQ2bTWYpkF7DcDADetaMNg_hKY6_gIH";

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem("admin_auth") === "true";
    });
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [loginError, setLoginError] = useState("");
    const [activeTab, setActiveTab] = useState("overview");

    // Dynamic Lists
    const [usersList, setUsersList] = useState([]);
    const [jobsList, setJobsList] = useState(INITIAL_JOBS);
    const [scholarshipsList, setScholarshipsList] = useState(INITIAL_SCHOLARSHIPS);
    const [videosList, setVideosList] = useState([]);

    // Modal forms states
    const [showJobModal, setShowJobModal] = useState(false);
    const [newJob, setNewJob] = useState({ role: "", company: "", pay: "", type: "Remote", duration: "" });

    const [showScholarshipModal, setShowScholarshipModal] = useState(false);
    // Added link field for application URL
    const [newScholarship, setNewScholarship] = useState({ title: "", reward: "", deadline: "", criteria: "", link: "" });

    const [showVideoModal, setShowVideoModal] = useState(false);
    const [newVideo, setNewVideo] = useState({ title: "", category: "", videoUrl: "", thumbnailUrl: "", duration: "10:00" });

    // Fetch users list from backend
    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/admin/users/");
            const data = await response.json();
            if (data.success) {
                setUsersList(data.users);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const fetchVideos = async () => {
        try {
            const response = await fetch("/api/courses/videos/");
            const data = await response.json();
            if (data.success) {
                setVideosList(data.videos);
            }
        } catch (err) {
            console.error("Error fetching videos:", err);
        }
    };

    const fetchScholarships = async () => {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/scholarships?select=*&order=id.desc`, {
                method: "GET",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setScholarshipsList(data);
            }
        } catch (err) {
            console.error("Error fetching scholarships from Supabase:", err);
        }
    };

    useEffect(() => {
        let active = true;
        async function loadData() {
            try {
                const response = await fetch("/api/admin/users/");
                const data = await response.json();
                if (data.success && active) {
                    setUsersList(data.users);
                }
            } catch (err) {
                console.error("Error fetching users:", err);
            }

            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/scholarships?select=*&order=id.desc`, {
                    method: "GET",
                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization": `Bearer ${SUPABASE_KEY}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok && active) {
                    const data = await response.json();
                    setScholarshipsList(data);
                }
            } catch (err) {
                console.error("Error fetching scholarships from Supabase:", err);
            }

            try {
                const response = await fetch("/api/courses/videos/");
                const data = await response.json();
                if (data.success && active) {
                    setVideosList(data.videos);
                }
            } catch (err) {
                console.error("Error fetching videos:", err);
            }
        }
        if (isAuthenticated) {
            loadData();
        }
        return () => {
            active = false;
        };
    }, [isAuthenticated]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError("");

        // Handle Varun27 and " Varun27" (handling spaces as requested)
        const checkUser = usernameInput.trim();
        const checkPass = passwordInput.trim();

        if (checkUser === "Varun27" && checkPass === "Varun27") {
            try {
                const response = await fetch("/api/login/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: checkUser, password: checkPass }),
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    setIsAuthenticated(true);
                    sessionStorage.setItem("admin_auth", "true");
                } else {
                    setLoginError(data.message || "Backend login failed.");
                }
            } catch (err) {
                console.error("Admin backend auth error:", err);
                setLoginError("Failed to connect to authentication server.");
            }
        } else {
            setLoginError("Invalid Admin ID or Password. Access Denied.");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem("admin_auth");
        window.location.hash = ""; // Clear hash navigation
        window.history.pushState(null, "", "/"); // Direct home
    };

    // User moderation actions
    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to permanently delete this user?")) return;

        try {
            const response = await fetch(`/api/admin/users/?id=${userId}`, {
                method: "DELETE"
            });
            const data = await response.json();
            if (data.success) {
                // Refresh list
                fetchUsers();
            } else {
                alert(data.message || "Failed to delete user.");
            }
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Error deleting user.");
        }
    };

    // Post job action
    const handleAddJob = (e) => {
        e.preventDefault();
        if (!newJob.role || !newJob.company) return;

        const jobEntry = {
            id: Date.now(),
            ...newJob
        };

        setJobsList([jobEntry, ...jobsList]);
        setShowJobModal(false);
        setNewJob({ role: "", company: "", pay: "", type: "Remote", duration: "" });
    };

    // Post scholarship action
    const handleAddScholarship = async (e) => {
        e.preventDefault();
        if (!newScholarship.title || !newScholarship.reward) return;

        const scholarshipEntry = {
            title: newScholarship.title,
            reward: newScholarship.reward,
            deadline: newScholarship.deadline,
            criteria: newScholarship.criteria,
            link: newScholarship.link,
        };

        // Save to Supabase via REST API
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/scholarships`, {
                method: "POST",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Content-Type": "application/json",
                    "Prefer": "return=representation",
                },
                body: JSON.stringify(scholarshipEntry),
            });
            if (!response.ok) throw new Error(`Supabase error: ${response.status}`);
            
            // Refresh list from Supabase
            await fetchScholarships();
        } catch (err) {
            console.error("Failed to save scholarship to Supabase", err);
            alert("Failed to save scholarship to Supabase. Make sure the table exists and RLS policies are set.");
        }
        setShowScholarshipModal(false);
        setNewScholarship({ title: "", reward: "", deadline: "", criteria: "", link: "" });
    };

    const handleDeleteScholarship = async (scholarshipId) => {
        if (!window.confirm("Are you sure you want to permanently delete this scholarship?")) return;

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/scholarships?id=eq.${scholarshipId}`, {
                method: "DELETE",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error(`Supabase error: ${response.status}`);
            
            // Refresh list
            await fetchScholarships();
        } catch (err) {
            console.error("Failed to delete scholarship from Supabase", err);
            alert("Error deleting scholarship.");
        }
    };

    // Video management actions
    const handleAddVideo = async (e) => {
        e.preventDefault();
        if (!newVideo.title || !newVideo.category || !newVideo.videoUrl) return;

        try {
            const response = await fetch("/api/admin/videos/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newVideo)
            });
            const data = await response.json();
            if (data.success) {
                setVideosList([...videosList, data.video]);
                setShowVideoModal(false);
                setNewVideo({ title: "", category: "", videoUrl: "", thumbnailUrl: "", duration: "10:00" });
            } else {
                alert(data.message || "Failed to add video.");
            }
        } catch (err) {
            console.error("Error adding video:", err);
            alert("Error adding video.");
        }
    };

    const handleDeleteVideo = async (videoId) => {
        if (!window.confirm("Are you sure you want to permanently delete this video?")) return;

        try {
            const response = await fetch(`/api/admin/videos/?id=${videoId}`, {
                method: "DELETE"
            });
            const data = await response.json();
            if (data.success) {
                setVideosList(videosList.filter(v => v.id !== videoId));
            } else {
                alert(data.message || "Failed to delete video.");
            }
        } catch (err) {
            console.error("Error deleting video:", err);
            alert("Error deleting video.");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-wrapper">
                <div className="admin-login-container">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="admin-login-card"
                    >
                        <div className="admin-login-header">
                            <h2>ShikshaSetu</h2>
                            <p>Administrative Access Gate</p>
                        </div>

                        {loginError && (
                            <div className="admin-error-box">
                                <AlertCircle size={18} />
                                <span>{loginError}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className="admin-input-group">
                                <label>Admin ID</label>
                                <input 
                                    type="text" 
                                    className="admin-input"
                                    value={usernameInput}
                                    onChange={(e) => setUsernameInput(e.target.value)}
                                    placeholder="Enter your admin ID"
                                    required 
                                />
                            </div>

                            <div className="admin-input-group">
                                <label>Password</label>
                                <input 
                                    type="password" 
                                    className="admin-input"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    placeholder="Enter password"
                                    required 
                                />
                            </div>

                            <button type="submit" className="admin-login-btn">
                                Verify & Authenticate
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-wrapper">
            {/* Header Navbar */}
            <header className="admin-navbar">
                <div className="admin-nav-left">
                    <h1>ShikshaSetu Admin Panel</h1>
                </div>
                <div className="admin-nav-right">
                    <div className="admin-user-profile">
                        <div className="admin-avatar">V</div>
                        <span className="admin-username">Varun27</span>
                    </div>
                    <button className="admin-logout-btn" onClick={handleLogout} title="Log Out">
                        <LogOut size={16} />
                    </button>
                </div>
            </header>

            {/* Sub-nav Tab links */}
            <nav className="admin-tab-bar">
                <button 
                    onClick={() => setActiveTab("overview")} 
                    className={`admin-tab-btn ${activeTab === "overview" ? "active" : ""}`}
                >
                    <BarChart3 size={15} /> Overview
                </button>
                <button 
                    onClick={() => setActiveTab("users")} 
                    className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
                >
                    <Users size={15} /> User Moderation
                </button>
                <button 
                    onClick={() => setActiveTab("jobs")} 
                    className={`admin-tab-btn ${activeTab === "jobs" ? "active" : ""}`}
                >
                    <Briefcase size={15} /> Job Postings
                </button>
                <button 
                    onClick={() => setActiveTab("scholarships")} 
                    className={`admin-tab-btn ${activeTab === "scholarships" ? "active" : ""}`}
                >
                    <Award size={15} /> Scholarships
                </button>
                <button 
                    onClick={() => setActiveTab("videos")} 
                    className={`admin-tab-btn ${activeTab === "videos" ? "active" : ""}`}
                >
                    <Video size={15} /> Video Manager
                </button>
            </nav>

            {/* Dashboard Workspace */}
            <main className="admin-main-panel">
                <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="admin-page-header">
                                <h2>Overview & Portal Health</h2>
                                <p>Monitor live user counts, post approvals, and operational health status.</p>
                            </div>

                            {/* Analytics Summary */}
                            <div className="admin-stats-grid">
                                <div className="admin-stat-card">
                                    <div className="admin-stat-icon">
                                        <Users size={22} />
                                    </div>
                                    <div className="admin-stat-info">
                                        <span className="admin-stat-label">Registered Users</span>
                                        <span className="admin-stat-value">{usersList.length}</span>
                                    </div>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="admin-stat-icon">
                                        <Briefcase size={22} />
                                    </div>
                                    <div className="admin-stat-info">
                                        <span className="admin-stat-label">Active Placements</span>
                                        <span className="admin-stat-value">{jobsList.length}</span>
                                    </div>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="admin-stat-icon">
                                        <Award size={22} />
                                    </div>
                                    <div className="admin-stat-info">
                                        <span className="admin-stat-label">Scholarships Available</span>
                                        <span className="admin-stat-value">{scholarshipsList.length}</span>
                                    </div>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="admin-stat-icon">
                                        <Video size={22} />
                                    </div>
                                    <div className="admin-stat-info">
                                        <span className="admin-stat-label">Video Lectures</span>
                                        <span className="admin-stat-value">{videosList.length}</span>
                                    </div>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="admin-stat-icon">
                                        <Shield size={22} />
                                    </div>
                                    <div className="admin-stat-info">
                                        <span className="admin-stat-label">Admin Security</span>
                                        <span className="admin-stat-value">Active</span>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-layout-grid">
                                {/* System Status Panel */}
                                <div className="admin-panel-card">
                                    <div className="admin-card-header">
                                        <h3>User Moderation Summary</h3>
                                        <button className="admin-action-btn" onClick={() => setActiveTab("users")}>
                                            View Users <ArrowRight size={14} />
                                        </button>
                                    </div>
                                    <div className="admin-table-container">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Name / Email</th>
                                                    <th>Contact</th>
                                                    <th>Academic Skills</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {usersList.slice(0, 3).map((user) => (
                                                    <tr key={user.id}>
                                                        <td>
                                                            <div className="user-meta-td">
                                                                <span className="user-fullname">{user.fullName || "Unnamed User"}</span>
                                                                <span className="user-username-badge">{user.username}</span>
                                                            </div>
                                                        </td>
                                                        <td>{user.mobileNumber || "N/A"}</td>
                                                        <td>{user.skills || "None added"}</td>
                                                    </tr>
                                                ))}
                                                {usersList.length === 0 && (
                                                    <tr>
                                                        <td colSpan="3" style={{ textAlign: "center" }}>No registered users found.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Live Server timeline logs */}
                                <div className="admin-panel-card">
                                    <div className="admin-card-header">
                                        <h3>Administrative Logs</h3>
                                    </div>
                                    <div className="admin-timeline">
                                        <div className="timeline-item">
                                            <div className="timeline-dot"><Shield size={10} /></div>
                                            <div className="timeline-info">
                                                <span className="timeline-title">Admin login verification</span>
                                                <span className="timeline-time">Just now</span>
                                                <span className="timeline-desc">Varun27 logged in from IP 127.0.0.1</span>
                                            </div>
                                        </div>
                                        <div className="timeline-item">
                                            <div className="timeline-dot"><UserCheck size={10} /></div>
                                            <div className="timeline-info">
                                                <span className="timeline-title">Synchronized user listings</span>
                                                <span className="timeline-time">5 mins ago</span>
                                                <span className="timeline-desc">Pulled registered users list from Django model DB.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "users" && (
                        <motion.div
                            key="users"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="admin-page-header">
                                <h2>User Registration Moderation</h2>
                                <p>Manage user credentials, view academic progress files, and remove inactive or invalid student profiles.</p>
                            </div>

                            <div className="admin-panel-card">
                                <div className="admin-card-header">
                                    <h3>Total System Registrations ({usersList.length})</h3>
                                    <button className="admin-action-btn" onClick={fetchUsers}>Refresh List</button>
                                </div>

                                <div className="admin-table-container">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Name & Username</th>
                                                <th>Email Address</th>
                                                <th>Mobile Number</th>
                                                <th>Skills & Bio</th>
                                                <th>Moderation</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usersList.map((user) => (
                                                <tr key={user.id}>
                                                    <td>
                                                        <div className="user-meta-td">
                                                            <span className="user-fullname">{user.fullName || "Unnamed User"}</span>
                                                            <span className="user-username-badge">ID: {user.id}</span>
                                                        </div>
                                                    </td>
                                                    <td>{user.email}</td>
                                                    <td>{user.mobileNumber || "N/A"}</td>
                                                    <td>
                                                        <div className="flex flex-col gap-1 max-w-xs">
                                                            <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#F2B345" }}>{user.skills || "No skills listed"}</span>
                                                            <span style={{ fontSize: "0.8rem", color: "var(--admin-text-secondary)" }} className="truncate">{user.bio || "No biography added"}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button 
                                                            className="btn-delete-row"
                                                            onClick={() => handleDeleteUser(user.id)}
                                                        >
                                                            <Trash2 size={13} style={{ display: "inline", marginRight: "3px" }} /> Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {usersList.length === 0 && (
                                                <tr>
                                                    <td colSpan="5">
                                                        <div className="no-data-msg">
                                                            <Users size={32} />
                                                            <span>No user profiles are registered on this portal.</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "jobs" && (
                        <motion.div
                            key="jobs"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="admin-page-header">
                                <h2>Job & Placement Postings</h2>
                                <p>Manage active job vacancies and internship placements visible on the student home feed.</p>
                            </div>

                            <div className="admin-panel-card">
                                <div className="admin-card-header">
                                    <h3>Posted Listings ({jobsList.length})</h3>
                                    <button className="admin-action-btn" onClick={() => setShowJobModal(true)}>
                                        <Plus size={14} /> Post Placement
                                    </button>
                                </div>

                                <div className="admin-table-container">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Job Role</th>
                                                <th>Company</th>
                                                <th>Location/Type</th>
                                                <th>Compensation</th>
                                                <th>Duration</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jobsList.map((job) => (
                                                <tr key={job.id}>
                                                    <td style={{ fontWeight: "600" }}>{job.role}</td>
                                                    <td>{job.company}</td>
                                                    <td>{job.type}</td>
                                                    <td>{job.pay}</td>
                                                    <td>{job.duration}</td>
                                                    <td>
                                                        <button 
                                                            className="btn-delete-row"
                                                            onClick={() => setJobsList(jobsList.filter(j => j.id !== job.id))}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "scholarships" && (
                        <motion.div
                            key="scholarships"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="admin-page-header">
                                <h2>Scholarship Awards Management</h2>
                                <p>Post grants, fellowships, and academic rewards for eligible portal applicants.</p>
                            </div>

                            <div className="admin-panel-card">
                                <div className="admin-card-header">
                                    <h3>Active Awards ({scholarshipsList.length})</h3>
                                    <button className="admin-action-btn" onClick={() => setShowScholarshipModal(true)}>
                                        <Plus size={14} /> Add Scholarship
                                    </button>
                                </div>

                                <div className="admin-table-container">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Award Title</th>
                                                <th>Reward Amount</th>
                                                <th>Eligibility Criteria</th>
                                                <th>Application Deadline</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {scholarshipsList.map((sc) => (
                                                <tr key={sc.id}>
                                                    <td style={{ fontWeight: "600" }}>{sc.title}</td>
                                                    <td style={{ color: "#10B981", fontWeight: "600" }}>{sc.reward}</td>
                                                    <td>{sc.criteria}</td>
                                                    <td>{sc.deadline}</td>
                                                    <td>
                                                        <button 
                                                            className="btn-delete-row"
                                                            onClick={() => handleDeleteScholarship(sc.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "videos" && (
                        <motion.div
                            key="videos"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="admin-page-header">
                                <h2>Video Course Management</h2>
                                <p>Upload/link recommended learning videos, set metadata, and monitor course lecture options.</p>
                            </div>

                            <div className="admin-panel-card">
                                <div className="admin-card-header">
                                    <h3>Recommended Course Videos ({videosList.length})</h3>
                                    <button className="admin-action-btn" onClick={() => setShowVideoModal(true)}>
                                        <Plus size={14} /> Add Video Lecture
                                    </button>
                                </div>

                                <div className="admin-table-container">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Thumbnail & Title</th>
                                                <th>Category</th>
                                                <th>Duration</th>
                                                <th>Video Source URL</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {videosList.map((video) => (
                                                <tr key={video.id}>
                                                    <td>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                            {video.thumbnail_url ? (
                                                                <img 
                                                                    src={video.thumbnail_url} 
                                                                    alt={video.title} 
                                                                    style={{ width: "80px", height: "45px", borderRadius: "6px", objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }} 
                                                                />
                                                            ) : (
                                                                <div style={{ width: "80px", height: "45px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                                                                    <Video size={16} style={{ opacity: 0.5 }} />
                                                                </div>
                                                            )}
                                                            <span style={{ fontWeight: "600" }}>{video.title}</span>
                                                        </div>
                                                    </td>
                                                    <td><span className="user-username-badge">{video.category}</span></td>
                                                    <td>{video.duration}</td>
                                                    <td>
                                                        <a 
                                                            href={video.video_url} 
                                                            target="_blank" 
                                                            rel="noreferrer" 
                                                            style={{ color: "#F2B345", textDecoration: "underline", fontSize: "0.85rem" }}
                                                            className="truncate block max-w-xs"
                                                        >
                                                            {video.video_url}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <button 
                                                            className="btn-delete-row"
                                                            onClick={() => handleDeleteVideo(video.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {videosList.length === 0 && (
                                                <tr>
                                                    <td colSpan="5">
                                                        <div className="no-data-msg">
                                                            <Video size={32} />
                                                            <span>No video lectures uploaded yet.</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Modal Dialog for adding Jobs */}
            {showJobModal && (
                <div className="admin-modal-overlay">
                    <motion.div className="admin-modal" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1.25rem" }}>Post New Job listing</h3>
                        <form onSubmit={handleAddJob} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div className="admin-input-group">
                                <label>Job / Internship Title</label>
                                <input 
                                    type="text" 
                                    className="admin-input" 
                                    value={newJob.role}
                                    onChange={(e) => setNewJob({ ...newJob, role: e.target.value })}
                                    placeholder="e.g. Backend Developer Intern" 
                                    required 
                                />
                            </div>
                            <div className="admin-input-group">
                                <label>Company Name</label>
                                <input 
                                    type="text" 
                                    className="admin-input" 
                                    value={newJob.company}
                                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                                    placeholder="e.g. Google India" 
                                    required 
                                />
                            </div>
                            <div className="admin-input-group">
                                <label>Compensation</label>
                                <input 
                                    type="text" 
                                    className="admin-input" 
                                    value={newJob.pay}
                                    onChange={(e) => setNewJob({ ...newJob, pay: e.target.value })}
                                    placeholder="e.g. ₹25,000/mo or ₹8 LPA" 
                                />
                            </div>
                            <div className="admin-input-group">
                                <label>Location Mode</label>
                                <select 
                                    className="admin-input" 
                                    value={newJob.type}
                                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                                >
                                    <option value="Remote">Remote</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="On-site">On-site</option>
                                </select>
                            </div>
                            <div className="admin-input-group">
                                <label>Duration / Job Type</label>
                                <input 
                                    type="text" 
                                    className="admin-input" 
                                    value={newJob.duration}
                                    onChange={(e) => setNewJob({ ...newJob, duration: e.target.value })}
                                    placeholder="e.g. 6 Months or Full-time" 
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setShowJobModal(false)}>Cancel</button>
                                <button type="submit" className="admin-action-btn">Post Placement</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Modal Dialog for adding Scholarships */}
            {showScholarshipModal && (
                <div className="admin-modal-overlay">
                    <motion.div className="admin-modal" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1.25rem" }}>Post New Scholarship Award</h3>
                        <form onSubmit={handleAddScholarship} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div className="admin-input-group">
                                <label>Scholarship Name / Award Title</label>
                                <input 
                                    type="text" 
                                    className="admin-input" 
                                    value={newScholarship.title}
                                    onChange={(e) => setNewScholarship({ ...newScholarship, title: e.target.value })}
                                    placeholder="e.g. Meritorious Student Fellowship" 
                                    required 
                                />
                            </div>
                            <div className="admin-input-group">
                                <label>Reward / Grant Amount</label>
                                <input 
                                    type="text" 
                                    className="admin-input" 
                                    value={newScholarship.reward}
                                    onChange={(e) => setNewScholarship({ ...newScholarship, reward: e.target.value })}
                                    placeholder="e.g. ₹60,000 or Full Tuition Cover" 
                                    required 
                                />
                            </div>
                             <div className="admin-input-group">
                                 <label>Eligibility Criteria</label>
                                 <input 
                                     type="text" 
                                     className="admin-input"
                                     value={newScholarship.criteria}
                                     onChange={(e) => setNewScholarship({ ...newScholarship, criteria: e.target.value })}
                                     placeholder="e.g. GPA > 8.0, Low income families" 
                                 />
                             </div>
                             <div className="admin-input-group">
                                 <label>Application Link (URL)</label>
                                 <input 
                                     type="url" 
                                     className="admin-input"
                                     value={newScholarship.link}
                                     onChange={(e) => setNewScholarship({ ...newScholarship, link: e.target.value })}
                                     placeholder="https://example.com/apply"
                                 />
                             </div>
                            <div className="admin-input-group">
                                <label>Application Deadline</label>
                                <input 
                                    type="text" 
                                    className="admin-input" 
                                    value={newScholarship.deadline}
                                    onChange={(e) => setNewScholarship({ ...newScholarship, deadline: e.target.value })}
                                    placeholder="e.g. 31 August 2026" 
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setShowScholarshipModal(false)}>Cancel</button>
                                <button type="submit" className="admin-action-btn">Add Scholarship</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
            {/* Modal Dialog for adding Videos */}
            {showVideoModal && (
                <div className="admin-modal-overlay">
                    <motion.div className="admin-modal" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1.25rem" }}>Post New Video Lecture</h3>
                        <form onSubmit={handleAddVideo} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div className="admin-input-group">
                                <label>Video Title</label>
                                <input 
                                    type="text" 
                                    className="admin-input" 
                                    value={newVideo.title}
                                    onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                                    placeholder="e.g. Introduction to React" 
                                    required 
                                />
                            </div>
                            <div className="admin-input-group">
                                <label>Category</label>
                                <input 
                                    type="text" 
                                    className="admin-input" 
                                    value={newVideo.category}
                                    onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                                    placeholder="e.g. Web Development" 
                                    required 
                                />
                            </div>
                            <div className="admin-input-group">
                                <label>Video Stream URL (MP4/HLS direct link)</label>
                                <input 
                                    type="url" 
                                    className="admin-input" 
                                    value={newVideo.videoUrl}
                                    onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                                    placeholder="https://example.com/stream.mp4" 
                                    required 
                                />
                            </div>
                            <div className="admin-input-group">
                                <label>Thumbnail Image URL (Optional)</label>
                                <input 
                                    type="url" 
                                    className="admin-input" 
                                    value={newVideo.thumbnailUrl}
                                    onChange={(e) => setNewVideo({ ...newVideo, thumbnailUrl: e.target.value })}
                                    placeholder="https://example.com/thumbnail.jpg" 
                                />
                            </div>
                            <div className="admin-input-group">
                                <label>Duration</label>
                                <input 
                                    type="text" 
                                    className="admin-input" 
                                    value={newVideo.duration}
                                    onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                                    placeholder="e.g. 12:45" 
                                    required
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setShowVideoModal(false)}>Cancel</button>
                                <button type="submit" className="admin-action-btn">Add Video Lecture</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
