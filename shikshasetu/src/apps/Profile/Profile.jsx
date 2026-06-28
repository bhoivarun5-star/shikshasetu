import { useState, useEffect, useRef } from "react";
import { GraduationCap, Camera, Loader2, Award, Search, X } from "lucide-react";
import "./profile.css";

const BADGE_COLORS = [
    {
        primary: "#e8773f", // Orange
        bg: "rgba(232, 119, 63, 0.05)",
        bgDark: "rgba(232, 119, 63, 0.09)",
        border: "rgba(232, 119, 63, 0.16)",
        borderDark: "rgba(232, 119, 63, 0.22)",
        hoverBorder: "rgba(232, 119, 63, 0.55)",
        hoverBg: "rgba(232, 119, 63, 0.12)",
        shadow: "rgba(232, 119, 63, 0.22)",
        iconBg: "rgba(232, 119, 63, 0.1)",
        hoverIconBg: "rgba(232, 119, 63, 0.22)"
    },
    {
        primary: "#3b82f6", // Blue
        bg: "rgba(59, 130, 246, 0.05)",
        bgDark: "rgba(59, 130, 246, 0.09)",
        border: "rgba(59, 130, 246, 0.16)",
        borderDark: "rgba(59, 130, 246, 0.22)",
        hoverBorder: "rgba(59, 130, 246, 0.55)",
        hoverBg: "rgba(59, 130, 246, 0.12)",
        shadow: "rgba(59, 130, 246, 0.22)",
        iconBg: "rgba(59, 130, 246, 0.1)",
        hoverIconBg: "rgba(59, 130, 246, 0.22)"
    },
    {
        primary: "#10b981", // Emerald
        bg: "rgba(16, 185, 129, 0.05)",
        bgDark: "rgba(16, 185, 129, 0.09)",
        border: "rgba(16, 185, 129, 0.16)",
        borderDark: "rgba(16, 185, 129, 0.22)",
        hoverBorder: "rgba(16, 185, 129, 0.55)",
        hoverBg: "rgba(16, 185, 129, 0.12)",
        shadow: "rgba(16, 185, 129, 0.22)",
        iconBg: "rgba(16, 185, 129, 0.1)",
        hoverIconBg: "rgba(16, 185, 129, 0.22)"
    },
    {
        primary: "#f59e0b", // Amber
        bg: "rgba(245, 158, 11, 0.05)",
        bgDark: "rgba(245, 158, 11, 0.09)",
        border: "rgba(245, 158, 11, 0.16)",
        borderDark: "rgba(245, 158, 11, 0.22)",
        hoverBorder: "rgba(245, 158, 11, 0.55)",
        hoverBg: "rgba(245, 158, 11, 0.12)",
        shadow: "rgba(245, 158, 11, 0.22)",
        iconBg: "rgba(245, 158, 11, 0.1)",
        hoverIconBg: "rgba(245, 158, 11, 0.22)"
    },
    {
        primary: "#8b5cf6", // Violet
        bg: "rgba(139, 92, 246, 0.05)",
        bgDark: "rgba(139, 92, 246, 0.09)",
        border: "rgba(139, 92, 246, 0.16)",
        borderDark: "rgba(139, 92, 246, 0.22)",
        hoverBorder: "rgba(139, 92, 246, 0.55)",
        hoverBg: "rgba(139, 92, 246, 0.12)",
        shadow: "rgba(139, 92, 246, 0.22)",
        iconBg: "rgba(139, 92, 246, 0.1)",
        hoverIconBg: "rgba(139, 92, 246, 0.22)"
    },
    {
        primary: "#ec4899", // Pink
        bg: "rgba(236, 72, 153, 0.05)",
        bgDark: "rgba(236, 72, 153, 0.09)",
        border: "rgba(236, 72, 153, 0.16)",
        borderDark: "rgba(236, 72, 153, 0.22)",
        hoverBorder: "rgba(236, 72, 153, 0.55)",
        hoverBg: "rgba(236, 72, 153, 0.12)",
        shadow: "rgba(236, 72, 153, 0.22)",
        iconBg: "rgba(236, 72, 153, 0.1)",
        hoverIconBg: "rgba(236, 72, 153, 0.22)"
    },
    {
        primary: "#06b6d4", // Cyan
        bg: "rgba(6, 182, 212, 0.05)",
        bgDark: "rgba(6, 182, 212, 0.09)",
        border: "rgba(6, 182, 212, 0.16)",
        borderDark: "rgba(6, 182, 212, 0.22)",
        hoverBorder: "rgba(6, 182, 212, 0.55)",
        hoverBg: "rgba(6, 182, 212, 0.12)",
        shadow: "rgba(6, 182, 212, 0.22)",
        iconBg: "rgba(6, 182, 212, 0.1)",
        hoverIconBg: "rgba(6, 182, 212, 0.22)"
    },
    {
        primary: "#14b8a6", // Teal
        bg: "rgba(20, 184, 166, 0.05)",
        bgDark: "rgba(20, 184, 166, 0.09)",
        border: "rgba(20, 184, 166, 0.16)",
        borderDark: "rgba(20, 184, 166, 0.22)",
        hoverBorder: "rgba(20, 184, 166, 0.55)",
        hoverBg: "rgba(20, 184, 166, 0.12)",
        shadow: "rgba(20, 184, 166, 0.22)",
        iconBg: "rgba(20, 184, 166, 0.1)",
        hoverIconBg: "rgba(20, 184, 166, 0.22)"
    }
];

const getBadgeColor = (badgeName) => {
    if (!badgeName) return BADGE_COLORS[0];
    let hash = 0;
    for (let i = 0; i < badgeName.length; i++) {
        hash = badgeName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % BADGE_COLORS.length;
    return BADGE_COLORS[idx];
};

export default function Profile({ profileData, setProfileData }) {
    const [isUploading, setIsUploading] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const fileInputRef = useRef(null);

    const [viewedProfile, setViewedProfile] = useState(profileData);
    const [searchUsername, setSearchUsername] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState("");
    const [showSearchBar, setShowSearchBar] = useState(false);

    // Cropper States
    const [cropSrc, setCropSrc] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);
    const imageRef = useRef(null);

    useEffect(() => {
        if (!viewedProfile || viewedProfile.username === profileData.username) {
            setViewedProfile(profileData);
        }
    }, [profileData]);

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                const response = await fetch("/api/courses/videos/");
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        const enrolled = data.videos.filter(v => v.is_enrolled);
                        setEnrolledCourses(enrolled);
                    }
                }
            } catch (err) {
                console.error("Error fetching enrolled courses for profile:", err);
            }
        };
        fetchEnrolledCourses();
    }, []);

    const uploadProfileImage = async (base64Data) => {
        setIsUploading(true);
        try {
            const response = await fetch("/api/profile/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...profileData,
                    profile_image: base64Data
                }),
            });
            
            const data = await response.json();
            if (data.success) {
                setProfileData(prev => ({
                    ...prev,
                    profile_image: base64Data
                }));
            } else {
                alert(data.message || "Failed to update profile image.");
            }
        } catch (err) {
            console.error("Error uploading profile image:", err);
            alert("Error updating profile image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file (PNG/JPEG).");
            return;
        }

        if (file.size > 2.5 * 1024 * 1024) {
            alert("File is too large! Please upload an image under 2.5 MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setCropSrc(reader.result);
            setZoom(1);
            setPan({ x: 0, y: 0 });
            setImageLoaded(false);
        };
        reader.readAsDataURL(file);

        if (e.target) {
            e.target.value = "";
        }
    };

    const triggerFileSelect = () => {
        if (!isUploading) {
            fileInputRef.current?.click();
        }
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({
            x: e.clientX - pan.x,
            y: e.clientY - pan.y
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPan({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e) => {
        if (e.touches.length !== 1) return;
        setIsDragging(true);
        setDragStart({
            x: e.touches[0].clientX - pan.x,
            y: e.touches[0].clientY - pan.y
        });
    };

    const handleTouchMove = (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        setPan({
            x: e.touches[0].clientX - dragStart.x,
            y: e.touches[0].clientY - dragStart.y
        });
    };

    const handleCropApply = () => {
        if (!imageRef.current) return;
        
        const img = imageRef.current;
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        
        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext("2d");
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const containerSize = 280;
        const scaleFactor = 300 / containerSize;
        
        ctx.save();
        ctx.translate(150, 150);
        ctx.translate(pan.x * scaleFactor, pan.y * scaleFactor);
        ctx.scale(zoom, zoom);
        
        let drawWidth = containerSize;
        let drawHeight = containerSize;
        if (naturalWidth > naturalHeight) {
            drawWidth = (naturalWidth / naturalHeight) * containerSize;
        } else {
            drawHeight = (naturalHeight / naturalWidth) * containerSize;
        }
        
        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();
        
        const base64Data = canvas.toDataURL("image/jpeg", 0.9);
        uploadProfileImage(base64Data);
        setCropSrc(null);
    };

    const handleSearchSubmit = async (e) => {
        if (e) e.preventDefault();
        const query = searchUsername.trim();
        if (!query) return;
        
        setIsSearching(true);
        setSearchError("");
        
        try {
            const response = await fetch(`/api/profile/search/?username=${encodeURIComponent(query)}`);
            const data = await response.json();
            if (data.success && data.profile) {
                setViewedProfile(data.profile);
            } else {
                setSearchError(data.message || "User not found.");
            }
        } catch (err) {
            console.error("Error searching profile:", err);
            setSearchError("Failed to search user. Please try again.");
        } finally {
            setIsSearching(false);
        }
    };
    
    const handleResetToOwnProfile = () => {
        setViewedProfile(profileData);
        setSearchUsername("");
        setSearchError("");
        setShowSearchBar(false);
    };

    const skillList = viewedProfile?.skills 
        ? viewedProfile.skills.split(",").map(s => s.trim()).filter(Boolean)
        : [];

    return (
        <div className="profile-view-container">
            <div className="section-header text-center">
                <h2>User Directory & Profiles</h2>
                <p>Find students across ShikshaSetu, explore their earned certification badges, and review expertise.</p>
            </div>

            <div className="profile-dashboard-layout">
                {/* Center Content Column */}
                <div className="profile-preview-card">
                    <div className="student-profile-card">
                        <div className="card-top-decoration"></div>
                        
                        {/* Search toggle icon button top right */}
                        <button 
                            className="profile-search-toggle-btn"
                            onClick={() => setShowSearchBar(!showSearchBar)}
                            title={showSearchBar ? "Close search" : "Search profiles"}
                        >
                            {showSearchBar ? <X size={18} /> : <Search size={18} />}
                        </button>
                        
                        {showSearchBar && (
                            <div className="profile-search-dropdown-overlay">
                                <form onSubmit={handleSearchSubmit}>
                                    <input
                                        type="text"
                                        placeholder="Enter username..."
                                        value={searchUsername}
                                        onChange={(e) => setSearchUsername(e.target.value)}
                                        autoFocus
                                    />
                                    <button type="submit" disabled={isSearching}>
                                        {isSearching ? "..." : "Search"}
                                    </button>
                                </form>
                                {searchError && (
                                    <p className="search-error-msg">{searchError}</p>
                                )}
                                {viewedProfile.username !== profileData.username && (
                                    <button className="reset-profile-btn" onClick={handleResetToOwnProfile}>
                                        Back to My Profile
                                    </button>
                                )}
                            </div>
                        )}
                        
                        {/* Interactive Avatar */}
                        <div className="avatar-wrapper-profile">
                            <input 
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                            />
                            
                            <div 
                                className={`student-avatar-big ${viewedProfile.username === profileData.username ? "click-to-upload" : ""} ${isUploading ? "uploading" : ""}`}
                                onClick={viewedProfile.username === profileData.username ? triggerFileSelect : undefined}
                                style={{ 
                                    backgroundImage: viewedProfile.profile_image ? `url(${viewedProfile.profile_image})` : "none"
                                }}
                                title={viewedProfile.username === profileData.username ? "Click to upload profile photo" : ""}
                            >
                                    {!viewedProfile.profile_image && !isUploading && (
                                        <span>{viewedProfile.name ? viewedProfile.name.split(" ").map(w => w[0]).join("").toUpperCase() : "AS"}</span>
                                    )}
                                    
                                    {viewedProfile.username === profileData.username && (
                                        <div className="avatar-uploader-overlay">
                                            {isUploading ? (
                                                <Loader2 className="animate-spin text-white" size={24} />
                                            ) : (
                                                <>
                                                    <Camera size={20} />
                                                    <span className="overlay-upload-text">Upload</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h2 className="student-name">{viewedProfile.name || "Your Name"}</h2>
                            <p className="student-username">@{viewedProfile.username || "username"}</p>
                            {viewedProfile.phone && <p className="student-phone">{viewedProfile.phone}</p>}

                            <div className="student-card-divider"></div>

                            <div className="student-bio-block">
                                <h4>About Me</h4>
                                <p>{viewedProfile.bio || "No summary provided yet."}</p>
                            </div>

                            <div className="student-card-divider"></div>

                            <div className="student-skills-block">
                                <h4>Skills & Badges</h4>
                                <div className="student-skills-badge-list">
                                    {skillList.length > 0 ? (
                                        skillList.map((skill, i) => (
                                            <span key={i} className="student-badge-pill">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="no-skills-msg">No skills listed yet.</span>
                                    )}
                                </div>
                            </div>

                            <div className="student-card-divider"></div>

                            {viewedProfile.badges && viewedProfile.badges.length > 0 && (
                                <>
                                    <div className="student-badges-block">
                                        <h4>
                                            <Award size={16} /> Earned Course Badges
                                        </h4>
                                        <div className="earned-badges-grid">
                                            {viewedProfile.badges.map((badge, idx) => {
                                                const colors = getBadgeColor(badge.badge_name);
                                                const cardStyle = {
                                                    "--badge-color-bg": colors.bg,
                                                    "--badge-color-bg-dark": colors.bgDark,
                                                    "--badge-color-border": colors.border,
                                                    "--badge-color-border-dark": colors.borderDark,
                                                    "--badge-color-hover-border": colors.hoverBorder,
                                                    "--badge-color-hover-bg": colors.hoverBg,
                                                    "--badge-color-shadow": colors.shadow,
                                                    "--badge-color-icon-bg": colors.iconBg,
                                                    "--badge-color-hover-icon-bg": colors.hoverIconBg,
                                                    "--badge-color-primary": colors.primary
                                                };
                                                return (
                                                    <div key={idx} className="badge-item-card" style={cardStyle}>
                                                        <div className="badge-icon-wrapper">
                                                            <Award size={22} />
                                                        </div>
                                                        <span className="badge-title-text">
                                                            {badge.badge_name}
                                                        </span>
                                                        <span className="badge-date-text">
                                                            {badge.earned_at}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="student-card-divider"></div>
                                </>
                            )}

                            {viewedProfile.username === profileData.username && (
                                <div className="student-courses-block" style={{ marginTop: "1rem" }}>
                                    <h4 style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.92rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "0.75rem" }}>
                                        <GraduationCap size={15} style={{ color: "#E8773F" }} /> Enrolled Courses & Progress
                                    </h4>
                                    <div className="student-courses-progress-list" style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                                        {enrolledCourses.length > 0 ? (
                                            enrolledCourses.map((course) => (
                                                <div key={course.id} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: "600" }}>
                                                        <span style={{ color: "var(--text-main)", fontWeight: "650", fontSize: "0.85rem" }} title={course.title}>
                                                            {course.title}
                                                        </span>
                                                        <span style={{ color: "#E8773F" }}>{course.percentage}%</span>
                                                    </div>
                                                    <div style={{ height: "6px", background: "var(--border-color)", borderRadius: "3px", overflow: "hidden", width: "100%" }}>
                                                        <div style={{ height: "100%", width: `${course.percentage}%`, background: "linear-gradient(90deg, #E8773F, #F2B345)", borderRadius: "3px", transition: "width 0.4s ease-out" }}></div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <span style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>No active course enrollments yet.</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            {cropSrc && (
                <div className="crop-modal-overlay">
                    <div className="crop-modal-content">
                        <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>Crop Profile Photo</h3>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-light)", margin: 0, textAlign: "center" }}>Drag to reposition, use slider to zoom.</p>
                        
                        <div 
                            className="crop-workspace"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleMouseUp}
                        >
                            <img
                                ref={imageRef}
                                src={cropSrc}
                                alt="Crop Preview"
                                onLoad={() => setImageLoaded(true)}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                                    transformOrigin: "center",
                                    width: "auto",
                                    height: "auto",
                                    maxWidth: "none",
                                    maxHeight: "none",
                                    ...((imageRef.current && imageRef.current.naturalWidth > imageRef.current.naturalHeight) ? { height: "280px" } : { width: "280px" }),
                                    pointerEvents: "none",
                                    userSelect: "none"
                                }}
                            />
                        </div>
                        
                        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-light)", fontWeight: "600" }}>
                                <span>Zoom</span>
                                <span>{Math.round(zoom * 100)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="1" 
                                max="3" 
                                step="0.05" 
                                value={zoom} 
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                style={{ width: "100%", accentColor: "#E8773F", cursor: "pointer" }}
                            />
                        </div>
                        
                        <div style={{ display: "flex", gap: "0.75rem", width: "100%" }}>
                            <button className="crop-cancel-btn" onClick={() => setCropSrc(null)}>Cancel</button>
                            <button className="crop-apply-btn" onClick={handleCropApply}>Apply & Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
