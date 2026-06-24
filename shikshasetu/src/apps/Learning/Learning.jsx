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

export default function Learning({ learningSubTab, setLearningSubTab, t = (k, fallback) => fallback || k }) {
    const [selectedRoadmapStep, setSelectedRoadmapStep] = useState(1);
    const [videoLectures, setVideoLectures] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [watchProgressPercent, setWatchProgressPercent] = useState(0);
    const [enrollingVideo, setEnrollingVideo] = useState(null);
    const [videoSearchQuery, setVideoSearchQuery] = useState("");

    const filteredVideoLectures = videoLectures.filter(video => 
        video.title.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
        (video.category && video.category.toLowerCase().includes(videoSearchQuery.toLowerCase()))
    );

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
                    "Authorization": "Bearer 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",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "ShikshaSetu"
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-120b:free",
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
                        <div className="roadmap-header">
                            <h3>{t("roadmap_title", "Frontend Development Roadmap")}</h3>
                            <p>{t("roadmap_desc", "Click on any phase to view detail guides, topics, and checkpoints.")}</p>
                        </div>
                        <div className="roadmap-flow">
                            {[
                                { step: 1, title: t("web_foundations", "Web Foundations"), desc: t("web_foundations_desc", "HTML5 semantic tags, CSS layouts (Flexbox & Grid), responsive design."), topics: ["HTML5 semantic tags", "CSS layouts (Flexbox, Grid)", "Responsive media queries", "CSS variables"] },
                                { step: 2, title: t("javascript_core", "JavaScript Core"), desc: t("javascript_core_desc", "DOM manipulation, asynchronous fetching, fetch APIs, arrays callbacks."), topics: ["DOM dynamic scripts", "ES6+ variables & functions", "Promises & async/await", "Fetch APIs & HTTP requests"] },
                                { step: 3, title: t("react_framework", "React Framework"), desc: t("react_framework_desc", "React interactive components, state, hooks (useState, useEffect)."), topics: ["JSX & Components props", "useState & useEffect hooks", "React Router", "Vite & npm environments"] },
                                { step: 4, title: t("testing_deployment", "Testing & Deployment"), desc: t("testing_deployment_desc", "Vite, Git source branching, deploying static sites (Netlify, Vercel)."), topics: ["Git & GitHub source codes", "Vercel / Netlify cloud deploy", "Performance audits", "Portfolio projects"] },
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
                                {t("phase_details_checklist", `Phase ${selectedRoadmapStep} Details & Checklist`)}
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
                    <div className="courses-tab-view">


                        {/* Recommended Video Lectures */}
                        <div className="lectures-grid-section mt-10">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <Video className="text-[#e8773f]" size={20} />
                                {t("recommended_lectures_title", "Recommended Video Lectures")}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                                {t("recommended_lectures_desc", "Directly stream course lectures and track your progress in real-time.")}
                            </p>

                            <div className="flex gap-3 mt-4 mb-6">
                                <div className="premium-search-wrapper flex-1">
                                    <div className="premium-search-inner">
                                        <Search className="premium-search-icon" size={16} />
                                        <input
                                            type="text"
                                            placeholder={t("search_lectures_placeholder", "Search lectures...")}
                                            value={videoSearchQuery}
                                            onChange={(e) => setVideoSearchQuery(e.target.value)}
                                            className="premium-search-input"
                                        />
                                        {videoSearchQuery && (
                                            <button
                                                type="button"
                                                onClick={() => setVideoSearchQuery("")}
                                                className="premium-search-clear"
                                                title="Clear search"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <button type="button" className="premium-search-btn">
                                    <Search size={14} />
                                    <span>Search</span>
                                </button>
                            </div>
                            
                            <div className="content-grid mt-4">
                                {filteredVideoLectures.map((video) => (
                                    <div key={video.id} className="content-card relative group" style={{ cursor: "pointer" }} onClick={() => {
                                        if (video.is_enrolled) {
                                            setSelectedVideo(video);
                                            setWatchProgressPercent(video.percentage || 0);
                                        } else {
                                            setEnrollingVideo(video);
                                        }
                                    }}>
                                        <div className="video-thumbnail-container">
                                            {video.thumbnail_url ? (
                                                <img src={video.thumbnail_url} alt={video.title} />
                                            ) : (
                                                <div className="flex items-center justify-center h-full w-full bg-slate-900/60">
                                                    <Video size={40} className="text-slate-600" />
                                                </div>
                                            )}
                                            <span className="video-card-badge">{video.category}</span>
                                            <div className="play-overlay-btn">
                                                <div className="play-icon-circle">
                                                    <Play size={20} fill="white" />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <h3 className="mt-3 text-base font-bold leading-snug">{video.title}</h3>
                                        
                                        <div className="progress-container mt-3">
                                            <div className="progress-bar-bg">
                                                <div className="progress-bar-fill orange" style={{ width: `${video.percentage}%` }}></div>
                                            </div>
                                            <span className="text-xs font-semibold text-slate-500">{video.percentage}% Completed</span>
                                        </div>
                                        
                                        <div className="card-footer mt-4 flex justify-between items-center w-full">
                                            <span className="card-meta flex items-center gap-1 text-xs text-slate-500">
                                                <Clock size={12} /> {video.duration}
                                            </span>
                                            <button className="card-btn py-1.5 px-4 text-xs font-bold">
                                                {video.percentage > 0 ? t("resume", "Resume") : t("play_now", "Play")}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {filteredVideoLectures.length === 0 && (
                                    <div className="col-span-full text-center py-8 text-slate-500">
                                        {videoSearchQuery ? t("no_matching_lectures", "No lectures match your search query.") : t("no_lectures_yet", "No recommended video lectures uploaded yet.")}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Explore Online Courses (AI Search) */}
                        <div className="explore-courses-section mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                    <Compass className="text-indigo-500" size={20} />
                                    {t("explore_courses_title", "Explore Online Courses (AI Search)")}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    {t("explore_courses_desc", "Search and discover real, active courses from Coursera, Udemy, edX, and more, recommended in real-time by AI.")}
                                </p>
                            </div>

                            {/* AI Search input */}
                            <form onSubmit={fetchAICourses} className="explore-search-bar mt-6 flex gap-3">
                                <div className="explore-input-wrapper relative flex-1">
                                    <Search className="explore-search-icon absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder={t("explore_search_placeholder", "Enter a topic (e.g., Python, React, UI/UX, Cybersecurity)...")}
                                        value={exploreQuery}
                                        onChange={(e) => setExploreQuery(e.target.value)}
                                        className="explore-search-input w-full py-3 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                                        disabled={isExploring}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="explore-search-btn px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                                    disabled={isExploring || !exploreQuery.trim()}
                                >
                                    {isExploring ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>{t("searching", "Searching...")}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={16} />
                                            <span>{t("explore_ai", "Find Courses")}</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Error Box */}
                            {exploreError && (
                                <div className="explore-error-box mt-4 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm">
                                    {exploreError}
                                </div>
                            )}

                            {/* Results Grid */}
                            <div className="content-grid mt-8">
                                {isExploring ? (
                                    Array.from({ length: 3 }).map((_, idx) => (
                                        <div key={idx} className="content-card explore-card skeleton animate-pulse border border-slate-100 dark:border-slate-800">
                                            <div className="flex justify-between items-start">
                                                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                                                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                                            </div>
                                            <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg mt-4"></div>
                                            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-lg mt-3"></div>
                                            <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-lg mt-2"></div>
                                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                                                <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    exploreCourses.map((course, idx) => (
                                        <div key={idx} className={`content-card explore-card border-t-4 platform-${course.platform.toLowerCase()}`}>
                                            <div className="flex justify-between items-start">
                                                <span className={`explore-platform-badge ${course.platform.toLowerCase()}`}>
                                                    {course.platform}
                                                </span>
                                                <span className="card-badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                    {course.category}
                                                </span>
                                            </div>
                                            <h3 className="mt-4 text-base font-bold leading-snug line-clamp-2">{course.title}</h3>
                                            <p className="card-desc mt-2 text-xs line-clamp-3 leading-relaxed">{course.description}</p>
                                            <div className="card-footer mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center w-full">
                                                <span className="card-meta text-xs font-semibold">{course.level}</span>
                                                <a
                                                    href={course.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="card-btn flex items-center gap-1.5 py-2 px-4 text-xs font-bold"
                                                    style={{ textDecoration: 'none', display: 'inline-flex' }}
                                                >
                                                    <span>{t("view_course", "View")}</span>
                                                    <ExternalLink size={12} />
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
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
